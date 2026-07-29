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
            this.setState({ 
                error: 'Network error: ' + err.message, 
                scanning: false 
            });
        }
    };

    render() {
        const { target, scanType, ports, results, scanning, error } = this.state;

        return React.createElement('div', { className: 'container' },
            React.createElement('h1', null, '🔍 Forensic Port Scanner'),
            React.createElement('p', { className: 'subtitle' }, 'Professional Security Assessment Tool'),
            
            React.createElement('div', { className: 'input-group' },
                React.createElement('label', null, 'Target IP/Domain:'),
                React.createElement('input', {
                    type: 'text',
                    value: target,
                    placeholder: 'e.g., 192.168.1.1 or example.com',
                    onChange: (e) => this.setState({ target: e.target.value })
                })
            ),
            
            React.createElement('div', { className: 'input-group' },
                React.createElement('label', null, 'Scan Type:'),
                React.createElement('select', {
                    value: scanType,
                    onChange: (e) => this.setState({ scanType: e.target.value })
                },
                    React.createElement('option', { value: 'tcp' }, 'TCP Scan'),
                    React.createElement('option', { value: 'udp' }, 'UDP Scan'),
                    React.createElement('option', { value: 'syn' }, 'SYN Scan')
                )
            ),
            
            React.createElement('div', { className: 'input-group' },
                React.createElement('label', null, 'Port Range:'),
                React.createElement('input', {
                    type: 'text',
                    value: ports,
                    placeholder: 'e.g., 1-1024',
                    onChange: (e) => this.setState({ ports: e.target.value })
                })
            ),
            
            React.createElement('button', {
                onClick: this.handleScan,
                disabled: scanning || !target
            }, scanning ? '⏳ Scanning...' : '🚀 Start Scan'),
            
            error && React.createElement('div', { className: 'error' }, error),
            
            results && React.createElement('div', { className: 'results' },
                React.createElement('h2', null, '📊 Scan Results'),
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
                                    style: { backgroundColor: port.state === 'open' ? '#d4edda' : '#f8d7da' }
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
            )
        );
    }
}

ReactDOM.render(React.createElement(PortScanner), document.getElementById('app'));
