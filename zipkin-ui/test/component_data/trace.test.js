import {convertSuccessResponse, toContextualLogsUrl} from '../../js/component_data/trace';
import {errorTrace, httpTrace, skewedTrace} from '../component_ui/traceTestHelpers';

describe('convertSuccessResponse', () => {
  it('should convert an http trace', () => {
    const spans = [
      {
        spanId: 'bb1f0e21882325b8',
        parentId: null,
        spanName: 'get /',
        serviceNames: 'frontend',
        serviceName: 'frontend',
        duration: 168731,
        durationStr: '168.731ms',
        left: 0,
        width: 100,
        depth: 10,
        depthClass: 0,
        children: 'c8c50ebd2abc179e',
        annotations: [
          {
            isCore: true,
            left: 0,
            endpoint: '172.17.0.13 (frontend)',
            value: 'Server Receive',
            timestamp: 1541138169255688,
            relativeTime: '',
            width: 8
          },
          {
            isCore: true,
            left: 100,
            endpoint: '172.17.0.13 (frontend)',
            value: 'Server Send',
            timestamp: 1541138169424419,
            relativeTime: '168.731ms',
            width: 8
          }
        ],
        binaryAnnotations: [
          {
            key: 'http.method',
            value: 'GET',
            endpoint: {
              serviceName: 'frontend',
              ipv4: '172.17.0.13'
            }
          },
          {
            key: 'http.path',
            value: '/',
            endpoint: {
              serviceName: 'frontend',
              ipv4: '172.17.0.13'
            }
          },
          {
            key: 'mvc.controller.class',
            value: 'Frontend',
            endpoint: {
              serviceName: 'frontend',
              ipv4: '172.17.0.13'
            }
          },
          {
            key: 'mvc.controller.method',
            value: 'callBackend',
            endpoint: {
              serviceName: 'frontend',
              ipv4: '172.17.0.13'
            }
          },
          {
            key: 'Client Address',
            value: '[110.170.201.178]:63678',
            endpoint: {
              serviceName: '',
              ipv6: '110.170.201.178',
              port: 63678
            }
          }
        ],
        errorType: 'none'
      },
      {
        spanId: 'c8c50ebd2abc179e',
        parentId: 'bb1f0e21882325b8',
        spanName: 'get /api',
        serviceNames: 'frontend,backend',
        serviceName: 'backend',
        duration: 111121,
        durationStr: '111.121ms',
        left: 24.82294302765941,
        width: 65.8568964801963,
        depth: 15,
        depthClass: 1,
        children: '',
        annotations: [
          {
            isCore: true,
            left: 0,
            endpoint: '172.17.0.13 (frontend)',
            value: 'Client Send',
            timestamp: 1541138169297572,
            relativeTime: '41.884ms',
            width: 8
          },
          {
            isCore: true,
            left: 36.1074864337074,
            endpoint: '172.17.0.13 (frontend)',
            value: 'Wire Send',
            timestamp: 1541138169337695,
            relativeTime: '82.007ms',
            width: 8
          },
          {
            isCore: true,
            left: 38.15435426247064,
            endpoint: '172.17.0.9 (backend)',
            value: 'Server Receive',
            timestamp: 1541138169339969.5,
            relativeTime: '84.281ms',
            width: 8
          },
          {
            isCore: true,
            left: 61.84564573752937,
            endpoint: '172.17.0.9 (backend)',
            value: 'Server Send',
            timestamp: 1541138169366295.5,
            relativeTime: '110.608ms',
            width: 8
          },
          {
            isCore: true,
            left: 63.8925135662926,
            endpoint: '172.17.0.13 (frontend)',
            value: 'Wire Receive',
            timestamp: 1541138169368570,
            relativeTime: '112.882ms',
            width: 8
          },
          {
            isCore: true,
            left: 100,
            endpoint: '172.17.0.13 (frontend)',
            value: 'Client Receive',
            timestamp: 1541138169408693,
            relativeTime: '153.005ms',
            width: 8
          }
        ],
        binaryAnnotations: [
          {
            key: 'http.method',
            value: 'GET',
            endpoint: {
              serviceName: 'frontend',
              ipv4: '172.17.0.13'
            }
          },
          {
            key: 'http.path',
            value: '/api',
            endpoint: {
              serviceName: 'frontend',
              ipv4: '172.17.0.13'
            }
          },
          {
            key: 'mvc.controller.class',
            value: 'Backend',
            endpoint: {
              serviceName: 'backend',
              ipv4: '172.17.0.9'
            }
          },
          {
            key: 'mvc.controller.method',
            value: 'printDate',
            endpoint: {
              serviceName: 'backend',
              ipv4: '172.17.0.9'
            }
          },
          {
            key: 'Client Address',
            value: '172.17.0.13:63679',
            endpoint: {
              serviceName: '',
              ipv4: '172.17.0.13',
              port: 63679
            }
          }
        ],
        errorType: 'none'
      }
    ];

    const timeMarkers = [
      {index: 0, time: ''},
      {index: 1, time: '33.746ms'},
      {index: 2, time: '67.492ms'},
      {index: 3, time: '101.239ms'},
      {index: 4, time: '134.985ms'},
      {index: 5, time: '168.731ms'}
    ];

    const expectedTemplate = {
      traceId: 'bb1f0e21882325b8',
      duration: '168.731ms',
      services: 2,
      depth: 2,
      totalSpans: 2,
      serviceCounts: [
        {name: 'backend', count: 1, max: 111},
        {name: 'frontend', count: 2, max: 168}
      ],
      timeMarkers,
      timeMarkersBackup: timeMarkers, // TODO: what is backup and why??
      spans,
      spansBackup: spans, // TODO: what is backup and why??
      logsUrl: undefined
    };

    const rawResponse = httpTrace;
    convertSuccessResponse(rawResponse).should.deep.equal(
      {modelview: expectedTemplate, trace: rawResponse}
    );
  });

  it('should convert an error trace', () => {
    const spans = [
      {
        spanId: '1e223ff1f80f1c69',
        parentId: null,
        spanName: '',
        serviceNames: 'backend',
        serviceName: 'backend',
        duration: 17,
        durationStr: '17μ',
        left: 0,
        width: 100,
        depth: 10,
        depthClass: 0,
        children: '',
        annotations: [],
        binaryAnnotations: [
          {
            key: 'error',
            value: 'request failed',
            endpoint: {
              serviceName: 'backend',
              ipv4: '172.17.0.9'
            }
          }
        ],
        errorType: 'critical'
      }
    ];

    const timeMarkers = [
      {index: 0, time: ''},
      {index: 1, time: '3.4000000000000004μ'},
      {index: 2, time: '6.800000000000001μ'},
      {index: 3, time: '10.2μ'},
      {index: 4, time: '13.600000000000001μ'},
      {index: 5, time: '17μ'}
    ];

    const expectedTemplate = {
      traceId: '1e223ff1f80f1c69',
      duration: '17μ',
      services: 1,
      depth: 1,
      totalSpans: 1,
      serviceCounts: [
        {name: 'backend', count: 1, max: 0}
      ],
      timeMarkers,
      timeMarkersBackup: timeMarkers, // TODO: what is backup and why??
      spans,
      spansBackup: spans, // TODO: what is backup and why??
      logsUrl: undefined
    };

    const rawResponse = errorTrace;
    convertSuccessResponse(rawResponse).should.deep.equal(
      {modelview: expectedTemplate, trace: rawResponse}
    );
  });

  it('should throw error on empty trace', () => {
    let error;
    try {
      convertSuccessResponse([]);
    } catch (err) {
      error = err;
    }

    expect(error.message).to.eql('Trace was empty');
  });

  it('should throw error on trace missing timestamp', () => {
    const missingTimestamp = {
      traceId: '2',
      id: '2',
      duration: 1,
      localEndpoint: {serviceName: 'B'}
    };

    let error;
    try {
      convertSuccessResponse([missingTimestamp]);
    } catch (err) {
      error = err;
    }

    expect(error.message).to.eql('Trace is missing a timestamp');
  });

  it('should convert a skewed trace', () => {
    const spans = [
      {
        spanId: 'bf396325699c84bf',
        parentId: null,
        spanName: 'get',
        serviceNames: 'servicea',
        serviceName: 'servicea',
        duration: 99411,
        durationStr: '99.411ms',
        left: 0,
        width: 100,
        depth: 10,
        depthClass: 0,
        children: '74280ae0c10d8062',
        annotations: [
          {
            isCore: true,
            left: 0,
            endpoint: '127.0.0.0 (servicea)',
            value: 'Server Receive',
            timestamp: 1470150004071068,
            relativeTime: '',
            width: 8
          },
          {
            isCore: true,
            left: 100,
            endpoint: '127.0.0.0 (servicea)',
            value: 'Server Send',
            timestamp: 1470150004170479,
            relativeTime: '99.411ms',
            width: 8
          }
        ],
        binaryAnnotations: [],
        errorType: 'none'
      },
      {
        spanId: '74280ae0c10d8062',
        parentId: 'bf396325699c84bf',
        spanName: 'post',
        serviceNames: 'servicea,serviceb',
        serviceName: 'serviceb',
        duration: 94539,
        durationStr: '94.539ms',
        left: 3.152568629226142,
        width: 95.09913389866313,
        depth: 15,
        depthClass: 1,
        children: '43210ae0c10d1234',
        annotations: [
          {
            isCore: true,
            left: 0,
            endpoint: '127.0.0.0 (servicea)',
            value: 'Client Send',
            timestamp: 1470150004074202,
            relativeTime: '3.134ms',
            width: 8
          },
          {
            isCore: true,
            left: 0.5087847343424406,
            endpoint: '192.0.0.0 (serviceb)',
            value: 'Server Receive',
            timestamp: 1470150004074683,
            relativeTime: '3.615ms',
            width: 8
          },
          {
            isCore: true,
            left: 99.49121526565756,
            endpoint: '192.0.0.0 (serviceb)',
            value: 'Server Send',
            timestamp: 1470150004168260,
            relativeTime: '97.192ms',
            width: 8
          },
          {
            isCore: true,
            left: 100,
            endpoint: '127.0.0.0 (servicea)',
            value: 'Client Receive',
            timestamp: 1470150004168741,
            relativeTime: '97.673ms',
            width: 8
          }
        ],
        binaryAnnotations: [],
        errorType: 'none'
      },
      {
        spanId: '43210ae0c10d1234',
        parentId: '74280ae0c10d8062',
        spanName: 'async',
        serviceNames: 'serviceb',
        serviceName: 'serviceb',
        duration: 65000,
        durationStr: '65.000ms',
        left: 3.6374244298920644,
        width: 65.3851183470642,
        depth: 20,
        depthClass: 2,
        children: '',
        annotations: [],
        binaryAnnotations: [
          {
            key: 'Local Address',
            value: '192.0.0.0 (serviceb)',
            endpoint: {
              serviceName: 'serviceb',
              ipv4: '192.0.0.0'
            }
          }
        ],
        errorType: 'none'
      }
    ];

    const timeMarkers = [
      {index: 0, time: ''},
      {index: 1, time: '19.882ms'},
      {index: 2, time: '39.764ms'},
      {index: 3, time: '59.647ms'},
      {index: 4, time: '79.529ms'},
      {index: 5, time: '99.411ms'}
    ];

    const expectedTemplate = {
      traceId: '1e223ff1f80f1c69',
      duration: '99.411ms',
      services: 2,
      depth: 3,
      totalSpans: 3,
      serviceCounts: [
        {name: 'servicea', count: 2, max: 99},
        {name: 'serviceb', count: 2, max: 94}
      ],
      timeMarkers,
      timeMarkersBackup: timeMarkers,
      spans,
      spansBackup: spans,
      logsUrl: undefined
    };

    const rawResponse = skewedTrace;
    convertSuccessResponse(rawResponse).should.deep.equal(
      {modelview: expectedTemplate, trace: rawResponse}
    );
  });
});

describe('toContextualLogsUrl', () => {
  it('replaces token in logsUrl when set', () => {
    const logsUrl = 'http://company.com/kibana/#/discover?_a=(query:(query_string:(query:\'{traceId}\')))';
    const traceId = '86bad84b319c8379';
    toContextualLogsUrl(logsUrl, traceId)
      .should.equal(logsUrl.replace('{traceId}', traceId));
  });

  it('returns logsUrl when not set', () => {
    const logsUrl = undefined;
    const traceId = '86bad84b319c8379';
    (typeof toContextualLogsUrl(logsUrl, traceId)).should.equal('undefined');
  });

  it('returns the same url when token not present', () => {
    const logsUrl = 'http://mylogqueryservice.com/';
    const traceId = '86bad84b319c8379';
    toContextualLogsUrl(logsUrl, traceId).should.equal(logsUrl);
  });
});
