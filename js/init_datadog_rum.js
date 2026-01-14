/**
 * Datadog RUM (Real User Monitoring) 초기화
 */
(function() {
  try {
    (function(h,o,u,n,d) {
      h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
      d=o.createElement(u);d.async=1;d.src=n

      d.onerror=function(){
        console.warn('Datadog RUM SDK failed to load. User monitoring will be disabled.');
      }

      n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
    })(window,document,'script','https://www.datadoghq-browser-agent.com/us1/v6/datadog-rum.js','DD_RUM')

    window.DD_RUM.onReady(function() {
      try {
        window.DD_RUM.init({
          clientToken: 'pub4b0d7410f941f04271a5ef090eb48d87',
          applicationId: 'bcdd1a85-8a90-4c8c-8594-8a3f35984f6e',
          site: 'datadoghq.com',
          service: 'brand-site',
          env: typeof TEST_SERVER !== 'undefined' && !TEST_SERVER ? 'prod' : 'dev',
          sessionSampleRate: 100,
          sessionReplaySampleRate: 20,
          trackUserInteractions: true,
          trackResources: true,
          trackLongTasks: true,
          trackBfcacheViews: true,
          defaultPrivacyLevel: 'mask-user-input',
	        beforeSend: function(event) {
		        if (event.type === 'resource') {
			        var url = event.resource.url;

			        // API 호출만 추적
			        if (event.resource.type === 'fetch' || event.resource.type === 'xhr') {
				        return true;
			        }

			        // MFE 앱 번들만 추적
			        if (url.indexOf('/_/') !== -1) {
				        return true;
			        }

			        // 나머지 리소스는 제외
			        return false;
		        }
		        return true;
	        }
        });

        window.DD_RUM.setAccount({
          ...(typeof SITE_CODE !== 'undefined' && { site_code: SITE_CODE }),
          ...(typeof UNIT_CODE !== 'undefined' && { unit_code: UNIT_CODE }),
          ...(typeof USE_SHOP_IN_SHOP !== 'undefined' && { use_shop_in_shop: USE_SHOP_IN_SHOP })
        });

        window.DD_RUM.setUser({
          ...(typeof MEMBER_HASH !== 'undefined' && MEMBER_HASH && { member_hash: MEMBER_HASH }),
          ...(typeof IS_GUEST !== 'undefined' && { is_guest: IS_GUEST })
        });
      } catch (initError) {
        console.error('Datadog RUM initialization failed:', initError);
      }
    });
  } catch (loadError) {
    console.warn('Datadog RUM setup failed:', loadError);
  }
})();
