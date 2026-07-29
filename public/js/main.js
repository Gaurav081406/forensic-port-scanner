class PortScanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            target: '',
            scanType: 'tcp',
            ports: '1-1024',
            results: null,
            scanning: false,
            error: ''
        };
    }

    handleScan = async () => {
        this.setState({ error: '', scanning: true });
        
        try {
            const response = await fetch('/api/port-scanner/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'forensic-scanner-key'
                },
                body: JSON.stringify({
                    target: this.state.target,
                    scanType: this.state.scanType,
                    ports: this.state.ports
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.setState({ results: data, scanning: false });
            } else {
                this.setState({ error: data.error || 'Scan failed', scanning: false });
            }
        } catch (err) {
            this.setState({ error: 'Network error: ' + err.message, scanning: false });
        }
    };

    render() {
        const { target, scanType, ports, results, scanning, error } = this.state;

        return React.createElement('div', { className: 'port-scanner' },
            React.createElement('h2', null, '🔍 Port Scanner'),
            
            React.createElement('div', { className: 'scan-controls' },
                React.createElement('div', { className: 'input-group' },
                    React.createElement('label', { htmlFor: 'target' }, 'Target IP/Domain:'),
                    React.createElement('input', {
                        type: 'text',
                        id: 'target',
                        placeholder: 'e.g., 192.168.1.1 or example.com',
                        value: target,
                        onChange: (e) => this.setState({ target: e.target.value })
                    })
                ),
                
                React.createElement('div', { className: 'input-group' },
                    React.createElement('label', { htmlFor: 'scanType' }, 'Scan Type:'),
                    React.createElement('select', {
                        id: 'scanType',
                        value: scanType,
                        onChange: (e) => this.setState({ scanType: e.target.value })
                    },
                        React.createElement('option', { value: 'tcp' }, 'TCP Scan (-sS)'),
                        React.createElement('option', { value: 'udp' }, 'UDP Scan (-sU)'),
                        React.createElement('option', { value: 'syn' }, 'SYN Scan'),
                        React.createElement('option', { value: 'full' }, 'Full Scan (-sS -sV -O)')
                    )
                ),
                
                React.createElement('div', { className: 'input-group' },
                    React.createElement('label', { htmlFor: 'ports' }, 'Port Range:'),
                    React.createElement('input', {
                        type: 'text',
                        id: 'ports',
                        placeholder: 'e.g., 1-1024, 22,80,443',
                        value: ports,
                        onChange: (e) => this.setState({ ports: e.target.value })
                    })
                ),
                
                React.createElement('button', {
                    className: 'scan-btn',
                    onClick: this.handleScan,
                    disabled: scanning || !target
                }, scanning ? '⏳ Scanning...' : '🚀 Start Scan')
            ),
            
            error && React.createElement('div', { className: 'error-message' }, error),
            
            results && React.createElement('div', { className: 'scan-results' },
                React.createElement('h3', null, '📊 Scan Results'),
                React.createElement('div', { className: 'results-table' },
                    React.createElement('table', null,
                        React.createElement('thead', null,
                            React.createElement('tr', null,
                                React.createElement('th', null, 'Port'),
                                React.createElement('th', null, 'State'),
                                React.createElement('th', null, 'Service'),
                                React.createElement('th', null, 'Version')
                            )
                        ),
                        React.createElement('tbody', null,
                            results.data.map((host, index) =>
                                host.ports.map((port, portIndex) =>
                                    React.createElement('tr', { 
                                        key: `${index}-${portIndex}`,
                                        className: port.state === 'open' ? 'open-port' : 'closed-port'
                                    },
                                        React.createElement('td', null, port.port),
                                        React.createElement('td', null, port.state),
                                        React.createElement('td', null, port.service || 'unknown'),
                                        React.createElement('td', null, port.version || '-')
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'export-btns' },
                    React.createElement('button', {
                        onClick: () => window.open('/api/port-scanner/export/' + results.scanId + '?format=csv'),
                        className: 'export-btn'
                    }, '📥 Export CSV'),
                    React.createElement('button', {
                        onClick: () => window.open('/api/port-scanner/export/' + results.scanId + '?format=pdf'),
                        className: 'export-btn'
                    }, '📄 Export PDF')
                )
            )
        );
    }
}

ReactDOM.render(React.createElement(PortScanner), document.getElementById('port-scanner-container'));
