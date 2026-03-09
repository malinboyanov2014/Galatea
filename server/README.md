How it works:                  
  - responseAdaptors is a map of i param → transform function. Add more entries there as needed.                                  
  - proxyRes fires after the upstream response arrives, buffers the body, parses it, applies the adaptor, and writes the modified response.                                 
  - If the URL doesn't match /search/item or there's no adaptor for the i param, the handler returns early and lets http-proxy-middleware pass through normally.            
                                                                                                                                                                            
  To add another item override, just extend the map:                                                                                                                        
  const responseAdaptors = {                                                                                                                                                
    reporting_bar_rcm_report: (data) => { data.data[0].report_type = 'list'; return data; },                                                                                
    some_other_item: (data) => { /* modify */ return data; },                                                                                                               
  };