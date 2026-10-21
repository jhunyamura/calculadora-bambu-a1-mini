package com.bambulab.calculadora3d

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Customizar Status Bar para combinar com o tema OLED Dark do Bambu Lab (#080b0f)
        window.statusBarColor = Color.parseColor("#080b0f")
        window.navigationBarColor = Color.parseColor("#080b0f")

        webView = WebView(this)
        setContentView(webView)

        configureWebView()

        // Carrega o aplicativo a partir dos assets locais empacotados no APK (100% offline)
        webView.loadUrl("file:///android_asset/index.html")

        // Controle do botão Voltar do Android
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.useWideViewPort = false
        settings.loadWithOverviewMode = false
        settings.textZoom = 100
        settings.setSupportZoom(false)
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.setBackgroundColor(Color.parseColor("#080b0f"))
        webView.overScrollMode = View.OVER_SCROLL_NEVER
        webView.isVerticalScrollBarEnabled = false
        webView.isHorizontalScrollBarEnabled = false

        // Bridge nativo para compartilhar orçamento direto pelo Android (WhatsApp / Redes)
        webView.addJavascriptInterface(AndroidBridge(), "AndroidNative")

        webView.webChromeClient = object : WebChromeClient() {}

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                
                // Redireciona links externos como WhatsApp Web para o aplicativo nativo instalado
                if (url.startsWith("https://api.whatsapp.com/") || url.startsWith("https://wa.me/")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, request.url)
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                return false
            }
        }
    }

    // Interface JavaScript -> Kotlin Nativo
    inner class AndroidBridge {
        @JavascriptInterface
        fun shareQuote(quoteText: String) {
            runOnUiThread {
                val sendIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_TEXT, quoteText)
                    type = "text/plain"
                }
                val shareIntent = Intent.createChooser(sendIntent, "Compartilhar Orçamento Bambu A1 Mini")
                startActivity(shareIntent)
            }
        }
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
