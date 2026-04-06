import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import '../css/InfoPages.css';

const sections = [
    {
        title: 'Eligibility for Returns',
        body: `Items may be returned within 7 days of delivery, provided they are in their original condition — unused, uninstalled, and in original packaging with all accessories and documentation included. Products that have been used, damaged by the buyer, or are missing original packaging are not eligible for a return.

Digital products including VST plugins and software licences are non-returnable once the licence key has been revealed or the download link accessed.`
    },
    {
        title: 'How to Initiate a Return',
        body: `To start a return, contact us at mail@acoustiq.co.ke within the 7-day window. Include your order details, the item you wish to return, and the reason for the return. Our team will review your request and respond within 1–2 business days with instructions on how to send the item back.

Please do not send items back without confirmation from us first — unrequested returns cannot be processed.`
    },
    {
        title: 'Condition of Returned Items',
        body: `Returned items must arrive in the same condition they were dispatched. All original accessories, cables, manuals, and packaging must be included. Items that arrive damaged, incomplete, or showing signs of use may be subject to a restocking fee or refused entirely.

We recommend using padded packaging and a tracked courier service when returning items. Acoustiq is not responsible for items lost or damaged in transit during a return.`
    },
    {
        title: 'Refunds',
        body: `Once we receive and inspect the returned item, we will process your refund within 3–5 business days. Refunds are issued to the original payment method — M-Pesa reversals are processed through Safaricom and may take up to 3 business days to reflect.

Original delivery fees are non-refundable unless the return is due to an error on our part (e.g. wrong item shipped, item arrived damaged).`
    },
    {
        title: 'Faulty or Damaged Items',
        body: `If your item arrives damaged or develops a manufacturing fault within 30 days of purchase, contact us immediately with photos of the damage. We will arrange a replacement or full refund at no cost to you, including return shipping.

Faults caused by misuse, accidental damage, or normal wear and tear are not covered under this policy.`
    },
    {
        title: 'Exchanges',
        body: `We do not currently offer direct exchanges. If you would like a different item, please return the original product following the process above and place a new order once your refund is confirmed.`
    },
];

const AccordionItem = ({ title, body }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`accordion-item ${open ? 'open' : ''}`}>
            <button className="accordion-trigger" onClick={() => setOpen(!open)}>
                <span>{title}</span>
                <FiChevronDown size={16} className="accordion-chevron" />
            </button>
            {open && (
                <div className="accordion-body">
                    {body.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

const ReturnsPolicy = () => (
    <div className="info-page">

        <div className="info-hero">
            <div className="info-hero-tag">Returns & Refunds</div>
            <h1 className="info-hero-title">Returns <em>Policy</em></h1>
            <p className="info-hero-sub">
                We want you to be happy with your purchase. If something isn't right,
                here's how we handle returns and refunds.
            </p>
        </div>

        <div className="info-divider" />

        <div className="info-prose-wrapper">
            <div className="policy-note">
                <strong>Last updated:</strong> January 2025 &nbsp;·&nbsp;
                Questions? Email <a href="mailto:mail@acoustiq.co.ke">mail@acoustiq.co.ke</a>
            </div>

            <div className="accordion">
                {sections.map((s, i) => (
                    <AccordionItem key={i} title={s.title} body={s.body} />
                ))}
            </div>
        </div>

    </div>
);

export default ReturnsPolicy;