# 📱 Guia do Aplicativo Android | Calculadora Bambu Lab A1 Mini

Esta pasta agora contém duas opções completas para você rodar e distribuir o aplicativo no Android:

---

## 🚀 Opção 1: Instalação Instantânea no Celular (PWA / WebAPK)
*Não precisa de Android Studio nem de compilação. Funciona em qualquer celular Android.*

1. **Inicie um servidor local** no computador:
   ```bash
   npx serve .
   # ou com python:
   python -m http.server 8080
   ```
2. **No celular Android:**
   - Conecte o celular na mesma rede Wi-Fi do computador.
   - Abra o navegador (Google Chrome, Edge, Brave ou Samsung Internet).
   - Digite o endereço do seu computador (ex: `http://192.168.1.X:8080`).
3. **Instalação:**
   - O aplicativo exibirá um botão verde no topo: **"Instalar no Celular"**.
   - Ou clique nos 3 pontinhos do Chrome (`⋮`) e selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
4. **Resultado:**
   - O ícone verde oficial da Bambu A1 Mini será criado na grade de apps do seu Android.
   - Abre em tela cheia (sem barra de URL do navegador).
   - Funciona **100% offline** (graças ao `sw.js` com cache inteligente).
   - Suporta botão de **"WhatsApp / Compartilhar"** nativo do Android.
   - Salva suas configurações de custos no próprio aparelho.

---

## 📦 Opção 2: Gerar o arquivo .APK em 1 Minuto (Online via PWABuilder)
Se você quer um arquivo `.apk` para instalar diretamente ou enviar via WhatsApp:

1. Publique esta pasta em qualquer hospedagem gratuita (Vercel, Netlify, GitHub Pages, Firebase).
2. Acesse [PWABuilder.com](https://www.pwabuilder.com/).
3. Cole a URL da sua aplicação e clique em **Start**.
4. Clique em **Package for Android**.
5. Baixe o pacote contendo o arquivo `.apk` pronto para instalar no seu celular ou enviar para clientes e amigos!

---

## 🛠️ Opção 3: Projeto Nativo Android Studio (`/android-app`)
Se você quer compilar o aplicativo no seu próprio computador através do Android Studio:

### Estrutura do Projeto:
- `android-app/`
  - `build.gradle.kts` e `settings.gradle.kts`
  - `app/src/main/AndroidManifest.xml`
  - `app/src/main/java/com/bambulab/calculadora3d/MainActivity.kt` (WebView nativo com ponte Kotlin para compartilhamento no Android)
  - `app/src/main/assets/` (Todo o HTML/CSS/JS empacotado dentro do APK - não precisa de servidor externo!)
  - `app/src/main/res/` (Ícones de aplicativo e temas Android)

### Como Compilar:
1. Abra o **Android Studio**.
2. Clique em **File > Open** e selecione a pasta `android-app`.
3. Aguarde o Gradle sincronizar as dependências.
4. Vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. O Android Studio gerará o arquivo `app-debug.apk` pronto para instalar no seu celular via cabo USB ou transferir via WhatsApp/Drive!
