import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-full flex items-center justify-center p-10 bg-[var(--bg-primary)]">
                    <div className="max-w-lg w-full border border-[var(--border-medium)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm p-10">
                        <div className="flex items-center gap-4 mb-6">
                            <AlertTriangle className="text-orange-500" size={32} />
                            <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--text-primary)]">
                                Component_Error
                            </h2>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                            {this.props.fallbackMessage || 'An error occurred loading this component. This may be due to wallet SDK initialization issues.'}
                        </p>

                        {this.state.error && (
                            <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-4 mb-6 font-mono text-xs text-red-400 break-all max-h-32 overflow-auto">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <button
                            onClick={this.handleRetry}
                            className="btn-terminal px-6 py-3 flex items-center gap-3 text-xs font-black tracking-widest"
                        >
                            <RefreshCw size={16} />
                            RETRY_LOAD
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
