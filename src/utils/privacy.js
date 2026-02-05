/**
 * Utility functions for privacy and anonymity
 */

/**
 * Generate a pseudonymous author ID from a hash
 * @param {string} hash - The hash or field value
 * @returns {string} - Pseudonymous ID like "anon_3f8a2"
 */
export const generateAnonId = (hash) => {
    if (!hash) return 'anon_unknown';

    // Take last 5 characters of hash for short ID
    const shortHash = hash.toString().slice(-5);
    return `anon_${shortHash}`;
};

/**
 * Generate a random field value for Leo
 * @returns {string} - Field value like "123456field"
 */
export const generateFieldId = () => {
    // Use timestamp + random for uniqueness
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}${random}field`;
};

/**
 * Hash text content to a field value
 * @param {string} content - Text content to hash
 * @returns {string} - Simple hash as field
 */
export const hashContent = (content) => {
    // Simple hash for now - in production use proper crypto
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `${Math.abs(hash)}field`;
};

/**
 * Format Aleo address for display
 * @param {string} address - Full Aleo address
 * @returns {string} - Shortened address like "aleo1...xyz"
 */
export const formatAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
};

/**
 * Parse timestamp to relative time
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} - Relative time like "5m ago"
 */
export const getRelativeTime = (timestamp) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    // Handle negative diff (future timestamps due to clock skew)
    if (diff < 0) return 'just now';
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};
