import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';
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
//  ADD PRODUCT
// ============================================================
const AddProduct = () => {
    const { user }   = useAuth();
    const navigate   = useNavigate();

    // ── FORM STATE ──
    const [productName,   setProductName]   = useState('');
    const [description,   setDescription]   = useState('');
    const [cost,          setCost]          = useState('');
    const [category,      setCategory]      = useState('');
    const [instrumentType,setInstrumentType]= useState('');
    const [brand,         setBrand]         = useState('');
    const [genre,         setGenre]         = useState('');
    const [level,         setLevel]         = useState('');
    const [condition,     setCondition]     = useState('');
    const [format,        setFormat]        = useState('N/A');
    const [featured,      setFeatured]      = useState(false);

    // ── IMAGE STATE ──
    const [mainPhoto,     setMainPhoto]     = useState(null);
    const [mainPreview,   setMainPreview]   = useState('');
    const [extraPhotos,   setExtraPhotos]   = useState([]);
    const [extraPreviews, setExtraPreviews] = useState([]);

    // ── UI STATE ──
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState('');
    const [success,  setSuccess]  = useState('');

    // ── GUARD: must be signed in ──
    if (!user) {
        return (
            <div className="page-wrapper">
                <div className="alert alert-error">
                    You must be signed in to add a product.{' '}
                    <button className="link-btn" onClick={() => navigate('/signin')}>
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    // ── MAIN PHOTO HANDLER ──
    const handleMainPhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMainPhoto(file);
        setMainPreview(URL.createObjectURL(file));
    };

    // ── EXTRA PHOTOS HANDLER ──
    const handleExtraPhotos = (e) => {
        const files = Array.from(e.target.files);
        const newFiles    = [...extraPhotos,   ...files];
        const newPreviews = [...extraPreviews, ...files.map(f => URL.createObjectURL(f))];
        setExtraPhotos(newFiles);
        setExtraPreviews(newPreviews);
    };

    // ── REMOVE EXTRA PHOTO ──
    const removeExtraPhoto = (index) => {
        setExtraPhotos(prev    => prev.filter((_, i) => i !== index));
        setExtraPreviews(prev  => prev.filter((_, i) => i !== index));
    };

    // ── SUBMIT ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!mainPhoto) {
            setError('Please upload a main product photo.');
            return;
        }
        if (!category) {
            setError('Please select a category.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('user_id',          user.user_id);
            formData.append('product_name',     productName);
            formData.append('product_description', description);
            formData.append('product_cost',     cost);
            formData.append('category',         category);
            formData.append('instrument_type',  instrumentType);
            formData.append('brand',            brand);
            formData.append('genre',            genre);
            formData.append('level',            level);
            formData.append('condition_status', condition);
            formData.append('format',           format);
            formData.append('featured',         featured ? 1 : 0);
            formData.append('product_photo',    mainPhoto);

            extraPhotos.forEach(photo => {
                formData.append('extra_images', photo);
            });

            await apiAddProduct(formData);
            setSuccess('Product added successfully!');

            // Reset form
            setProductName('');
            setDescription('');
            setCost('');
            setCategory('');
            setInstrumentType('');
            setBrand('');
            setGenre('');
            setLevel('');
            setCondition('');
            setFormat('N/A');
            setFeatured(false);
            setMainPhoto(null);
            setMainPreview('');
            setExtraPhotos([]);
            setExtraPreviews([]);

            setTimeout(() => navigate('/'), 2000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to add product. Please try again.'
            );
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
                    <p>Fill in the details below to list your product on Acoustiq</p>
                </div>

                {/* ── ALERTS ── */}
                {error   && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success} Redirecting...</div>}

                <form onSubmit={handleSubmit} className="addproduct-form">
                    <div className="addproduct-grid">

                        {/* ══ LEFT COLUMN ══ */}
                        <div className="addproduct-left">

                            {/* Main photo upload */}
                            <div className="form-section">
                                <h3 className="form-section-title">Main Photo</h3>
                                <div
                                    className={`photo-upload-box ${mainPreview ? 'has-preview' : ''}`}
                                    onClick={() => document.getElementById('main-photo-input').click()}
                                >
                                    {mainPreview ? (
                                        <img src={mainPreview} alt="Main preview" className="photo-preview" />
                                    ) : (
                                        <div className="photo-upload-placeholder">
                                            <FiUpload size={28} />
                                            <p>Click to upload main photo</p>
                                            <span>JPG, PNG, WEBP accepted</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="main-photo-input"
                                    accept="image/*"
                                    onChange={handleMainPhoto}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Extra photos */}
                            <div className="form-section">
                                <h3 className="form-section-title">Additional Photos</h3>
                                <div className="extra-photos-grid">
                                    {extraPreviews.map((preview, i) => (
                                        <div key={i} className="extra-photo-item">
                                            <img src={preview} alt={`Extra ${i + 1}`} />
                                            <button
                                                type="button"
                                                className="extra-photo-remove"
                                                onClick={() => removeExtraPhoto(i)}
                                            >
                                                <FiX size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <div
                                        className="extra-photo-add"
                                        onClick={() => document.getElementById('extra-photos-input').click()}
                                    >
                                        <FiPlus size={20} />
                                        <span>Add photos</span>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    id="extra-photos-input"
                                    accept="image/*"
                                    multiple
                                    onChange={handleExtraPhotos}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* Featured toggle */}
                            <div className="form-section">
                                <div className="featured-toggle-row">
                                    <div>
                                        <h3 className="form-section-title" style={{ marginBottom: '2px' }}>
                                            Featured Product
                                        </h3>
                                        <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                                            Show this product in the Editor's Pick section
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

                            {/* Basic info */}
                            <div className="form-section">
                                <h3 className="form-section-title">Basic Info</h3>

                                <div className="form-group">
                                    <label className="form-label">Product Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Fender Stratocaster"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Describe the product in detail — features, specs, condition notes..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Price (KES) *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g. 45000"
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="form-section">
                                <h3 className="form-section-title">Classification</h3>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select
                                            className="form-control"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
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

                    {/* ── SUBMIT ── */}
                    <div className="addproduct-submit">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-ice"
                            style={{ padding: '12px 32px' }}
                            disabled={loading}
                        >
                            {loading ? <Loader small /> : <><FiPlus size={15} /> Add Product</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;