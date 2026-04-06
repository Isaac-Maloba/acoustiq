import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { apiAddProduct } from '../utils/api';
import Loader from '../components/Loader';
import '../css/AddProduct.css';

// ============================================================
//  DROPDOWN OPTIONS
// ============================================================
const CATEGORIES = ['Physical Instrument', 'VST Plugin', 'Accessory'];

const INSTRUMENT_TYPES = [
    'Electric Guitar', 'Acoustic Guitar', 'Bass Guitar', 'Classical Guitar',
    'Electronic Drum Kit', 'Acoustic Drum Kit',
    'Digital Piano', 'Acoustic Piano', 'Keyboard',
    'MIDI Controller', 'Audio Interface', 'Microphone',
    'Studio Headphones', 'Violin', 'Viola', 'Cello', 'Double Bass',
    'Ukulele', 'Saxophone', 'Trumpet', 'Flute', 'Clarinet', 'Trombone',
    'DJ Controller', 'Synthesizer', 'Amplifier', 'Effects Pedal',
    'Studio Monitor', 'VST Instrument', 'VST Effect', 'VST Bundle',
    'Guitar Strings', 'Bass Strings', 'Violin Strings',
    'Guitar Pick', 'Guitar Strap', 'Guitar Stand', 'Guitar Capo',
    'Drum Sticks', 'Drum Pad', 'Drum Hardware',
    'Instrument Cable', 'Audio Cable',
    'Microphone Stand', 'Pop Filter',
    'Rosin', 'Bow', 'Case', 'Tuner', 'Metronome',
    'Sheet Music', 'Music Book'
];

const BRANDS = [
    'Fender', 'Gibson', 'Yamaha', 'Roland', 'Ibanez', 'Novation',
    'Akai', 'Shure', 'Audio-Technica', 'Focusrite', 'Boss',
    'Ernie Ball', 'Hercules', 'Fiddlerman', 'Steinberg',
    'Native Instruments', 'Arturia', 'Korg', 'Casio', 'Pearl',
    'Zildjian', 'Meinl', 'Sennheiser', 'Rode', 'Behringer',
    'Blackstar', 'Marshall', 'Orange', 'Vox', 'Other'
];

const GENRES = [
    'Universal', 'Rock', 'Blues', 'Jazz', 'Classical', 'Pop',
    'EDM', 'Hip-Hop', 'Afrobeats', 'Gospel', 'Country',
    'Metal', 'Reggae', 'R&B', 'Folk'
];

const LEVELS     = ['Beginner', 'Intermediate', 'Professional'];
const CONDITIONS = ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'];
const FORMATS    = ['N/A', 'VST2', 'VST3', 'AU', 'AAX', 'Standalone'];

// ============================================================
//  IMAGE COMPRESSOR
//  Resizes and compresses a File to JPEG, max 800px wide,
//  targeting under 300KB so AlwaysData never closes the connection.
// ============================================================
const compressImage = (file) =>
    new Promise((resolve, reject) => {
        const MAX_WIDTH  = 800;
        const MAX_HEIGHT = 800;
        const QUALITY    = 0.75; // 75% JPEG quality — good visually, small file

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;

                // Scale down proportionally
                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                    width  = Math.round(width  * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width  = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) { reject(new Error('Compression failed')); return; }
                        // Turn blob back into a File with a safe .jpg name
                        const safeName = file.name.replace(/\.[^.]+$/, '') + '_compressed.jpg';
                        resolve(new File([blob], safeName, { type: 'image/jpeg' }));
                    },
                    'image/jpeg',
                    QUALITY
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

// ============================================================
//  VALIDATION
// ============================================================
const validate = ({ productName, description, cost, category, mainPhoto }) => {
    const errors = {};
    if (!productName.trim())       errors.productName  = 'Product name is required.';
    if (!description.trim())       errors.description  = 'Description is required.';
    if (!cost || Number(cost) < 1) errors.cost         = 'Enter a valid price greater than 0.';
    if (!category)                 errors.category     = 'Please select a category.';
    if (!mainPhoto)                errors.mainPhoto    = 'A main product photo is required.';
    return errors;
};

// ============================================================
//  ADD PRODUCT
// ============================================================
const AddProduct = () => {
    const { user }   = useAuth();
    const navigate   = useNavigate();

    // ── FORM STATE ──
    const [productName,    setProductName]    = useState('');
    const [description,    setDescription]    = useState('');
    const [cost,           setCost]           = useState('');
    const [category,       setCategory]       = useState('');
    const [instrumentType, setInstrumentType] = useState('');
    const [brand,          setBrand]          = useState('');
    const [genre,          setGenre]          = useState('');
    const [level,          setLevel]          = useState('');
    const [condition,      setCondition]      = useState('');
    const [format,         setFormat]         = useState('N/A');
    const [featured,       setFeatured]       = useState(false);

    // ── PHOTO STATE ──
    const [mainPhoto,    setMainPhoto]    = useState(null);
    const [mainPreview,  setMainPreview]  = useState('');
    const [compressing,  setCompressing]  = useState(false);

    // ── UI STATE ──
    const [loading,  setLoading]  = useState(false);
    const [errors,   setErrors]   = useState({});
    const [apiError, setApiError] = useState('');
    const [success,  setSuccess]  = useState('');

    if (!user) { navigate('/signin'); return null; }

    // ── PHOTO HANDLER — compress on select ──
    const handleMainPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Clear previous photo error
        setErrors(prev => ({ ...prev, mainPhoto: '' }));

        // Show original preview immediately for responsiveness
        setMainPreview(URL.createObjectURL(file));
        setCompressing(true);

        try {
            const compressed = await compressImage(file);
            setMainPhoto(compressed);
            // Update preview to compressed version
            setMainPreview(URL.createObjectURL(compressed));
            const kb = Math.round(compressed.size / 1024);
            console.log(`Image compressed to ${kb}KB`);
        } catch (err) {
            console.error('Compression error:', err);
            // Fall back to original if compression fails
            setMainPhoto(file);
        } finally {
            setCompressing(false);
        }
    };

    // ── CLEAR PHOTO ──
    const handleClearPhoto = (e) => {
        e.stopPropagation();
        setMainPhoto(null);
        setMainPreview('');
        // Reset file input so same file can be re-selected
        const input = document.getElementById('main-photo-input');
        if (input) input.value = '';
    };

    // ── FIELD-LEVEL ERROR CLEAR ──
    const clearError = (field) => {
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // ── SUBMIT ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        // Client-side validation
        const validationErrors = validate({ productName, description, cost, category, mainPhoto });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Scroll to first error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('user_id',             user.user_id);
            formData.append('product_name',        productName.trim());
            formData.append('product_description', description.trim());
            formData.append('product_cost',        cost);
            formData.append('category',            category);
            formData.append('instrument_type',     instrumentType);
            formData.append('brand',               brand);
            formData.append('genre',               genre);
            formData.append('level',               level);
            formData.append('condition_status',    condition);
            formData.append('format',              format);
            formData.append('featured',            featured ? 1 : 0);
            formData.append('product_photo',       mainPhoto);

            await apiAddProduct(formData);
            setSuccess('Product added successfully!');
            setTimeout(() => navigate('/'), 2000);

        } catch (err) {
            if (err.code === 'ECONNABORTED') {
                setApiError('The request timed out. Please check your connection and try again.');
            } else if (err.response?.data?.message) {
                setApiError(err.response.data.message);
            } else {
                setApiError('Failed to add product. Please try again.');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    //  RENDER
    // ============================================================
    return (
        <div className="addproduct-page">
            <div className="addproduct-inner">

                {/* ── HEADER ── */}
                <div className="addproduct-header">
                    <h1>Add a Product</h1>
                    <p>List an instrument, plugin, or accessory for sale</p>
                </div>

                {/* ── ALERTS ── */}
                {apiError && (
                    <div className="alert alert-error">
                        <FiAlertCircle size={15} style={{ flexShrink: 0 }} />
                        {apiError}
                    </div>
                )}
                {success && <div className="alert alert-success">{success} Redirecting...</div>}

                {/* ── REQUIRED NOTE ── */}
                <p className="required-note">Fields marked <span className="req-star">*</span> are required.</p>

                <form onSubmit={handleSubmit} className="addproduct-form" noValidate>
                    <div className="addproduct-grid">

                        {/* ══ LEFT COLUMN ══ */}
                        <div className="addproduct-left">

                            {/* ── MAIN PHOTO ── */}
                            <div className="form-section">
                                <h3 className="form-section-title">
                                    Main Photo <span className="req-star">*</span>
                                </h3>

                                <div
                                    className={`photo-upload-box ${mainPreview ? 'has-preview' : ''} ${errors.mainPhoto ? 'photo-error' : ''}`}
                                    onClick={() => !compressing && document.getElementById('main-photo-input').click()}
                                    style={{ cursor: compressing ? 'wait' : 'pointer' }}
                                >
                                    {mainPreview ? (
                                        <>
                                            <img src={mainPreview} alt="Preview" className="photo-preview" />
                                            {/* Clear button */}
                                            <button
                                                type="button"
                                                className="photo-clear-btn"
                                                onClick={handleClearPhoto}
                                                title="Remove photo"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="photo-upload-placeholder">
                                            {compressing
                                                ? <><Loader small /><p>Compressing...</p></>
                                                : <><FiUpload size={28} /><p>Click to upload photo</p><span>JPG, PNG, WEBP · auto-compressed</span></>
                                            }
                                        </div>
                                    )}
                                </div>

                                {errors.mainPhoto && (
                                    <p className="field-error">{errors.mainPhoto}</p>
                                )}
                                {mainPreview && !compressing && (
                                    <p className="photo-hint">Click the image to replace it</p>
                                )}

                                <input
                                    type="file"
                                    id="main-photo-input"
                                    accept="image/*"
                                    onChange={handleMainPhoto}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* ── FEATURED TOGGLE ── */}
                            <div className="form-section">
                                <div className="featured-toggle-row">
                                    <div>
                                        <h3 className="form-section-title" style={{ marginBottom: '2px' }}>
                                            Featured Product
                                        </h3>
                                        <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                                            Show in Editor's Pick section
                                        </p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={featured}
                                            onChange={(e) => setFeatured(e.target.checked)}
                                        />
                                        <span className="toggle-knob" />
                                    </label>
                                </div>
                            </div>

                        </div>

                        {/* ══ RIGHT COLUMN ══ */}
                        <div className="addproduct-right">

                            {/* ── BASIC INFO ── */}
                            <div className="form-section">
                                <h3 className="form-section-title">Basic Info</h3>

                                <div className="form-group">
                                    <label className="form-label">
                                        Product Name <span className="req-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.productName ? 'input-error' : ''}`}
                                        placeholder="e.g. Fender Player Stratocaster"
                                        value={productName}
                                        onChange={(e) => { setProductName(e.target.value); clearError('productName'); }}
                                        maxLength={255}
                                    />
                                    {errors.productName && <p className="field-error">{errors.productName}</p>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Description <span className="req-star">*</span>
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'input-error' : ''}`}
                                        placeholder="Describe the product — condition, features, what's included..."
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value); clearError('description'); }}
                                        rows={5}
                                        maxLength={2000}
                                    />
                                    {errors.description && <p className="field-error">{errors.description}</p>}
                                    <p className="char-count">{description.length} / 2000</p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Price (KES) <span className="req-star">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.cost ? 'input-error' : ''}`}
                                        placeholder="e.g. 45000"
                                        value={cost}
                                        onChange={(e) => { setCost(e.target.value); clearError('cost'); }}
                                        min="1"
                                        max="9999999"
                                    />
                                    {errors.cost && <p className="field-error">{errors.cost}</p>}
                                </div>
                            </div>

                            {/* ── CLASSIFICATION ── */}
                            <div className="form-section">
                                <h3 className="form-section-title">Classification</h3>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Category <span className="req-star">*</span>
                                        </label>
                                        <select
                                            className={`form-control ${errors.category ? 'input-error' : ''}`}
                                            value={category}
                                            onChange={(e) => { setCategory(e.target.value); clearError('category'); }}
                                        >
                                            <option value="">Select category</option>
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        {errors.category && <p className="field-error">{errors.category}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Instrument Type</label>
                                        <select
                                            className="form-control"
                                            value={instrumentType}
                                            onChange={(e) => setInstrumentType(e.target.value)}
                                        >
                                            <option value="">Select type</option>
                                            {INSTRUMENT_TYPES.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Brand</label>
                                        <select
                                            className="form-control"
                                            value={brand}
                                            onChange={(e) => setBrand(e.target.value)}
                                        >
                                            <option value="">Select brand</option>
                                            {BRANDS.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Genre</label>
                                        <select
                                            className="form-control"
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                        >
                                            <option value="">Select genre</option>
                                            {GENRES.map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row-3">
                                    <div className="form-group">
                                        <label className="form-label">Level</label>
                                        <select
                                            className="form-control"
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                        >
                                            <option value="">Select level</option>
                                            {LEVELS.map(l => (
                                                <option key={l} value={l}>{l}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Condition</label>
                                        <select
                                            className="form-control"
                                            value={condition}
                                            onChange={(e) => setCondition(e.target.value)}
                                        >
                                            <option value="">Select condition</option>
                                            {CONDITIONS.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Format</label>
                                        <select
                                            className="form-control"
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value)}
                                        >
                                            {FORMATS.map(f => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── SUBMIT ROW ── */}
                    <div className="addproduct-submit">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-ice"
                            style={{ padding: '12px 32px' }}
                            disabled={loading || compressing}
                        >
                            {loading
                                ? <><Loader small /> Uploading...</>
                                : compressing
                                    ? <><Loader small /> Compressing image...</>
                                    : <><FiSave size={15} /> Add Product</>
                            }
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;