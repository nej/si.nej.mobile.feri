
(function () {
    feri.ui.createWebViewWindow = function (w) {
    	
    	if ( feri.testflight == true && !feri.isAndroid() ) {
			testflight.passCheckpoint("WebView window");	
		}
		
    	if ( w.title == 'undefined')
    		w.title = '';
    	
    	var webViewWindow = Titanium.UI.createWindow({
            id: 'webViewWindow',
            title: w.title,
            backgroundColor: '#FFF',
            barColor: feri.ui.barColor,
            navBarHidden: false,
            fullscreen: false
        });
        
        var webview = Ti.UI.createWebView({
        	url: w.url
        });
        
        webViewWindow.addEventListener('beforeload', function (e) {
        	feri.ui.activityIndicator.showModal('Nalagam ...', feri.loadLongTimeout, 'Napaka pri povezavi.');
        });
        
        webViewWindow.addEventListener('load', function (e) {
        	feri.ui.activityIndicator.hideModal();
        });
        
		feri.getWebcontrols(webViewWindow, webview);
		
		webViewWindow.add(webview);
        
        return webViewWindow;
    };
})();
