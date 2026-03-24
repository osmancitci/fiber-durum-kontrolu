# Fiber Durum Kontrol 🚀

**Fiber Durum Kontrol** projesi, bir binadaki tüm dairelerin internet altyapısını ve fiber durumunu hızlıca görselleştirmenizi sağlayan modern bir web uygulamasıdır. Ekranda hem görsel tablo hem de üstte renkli fiber bar ile anlık bilgi sunar. Ayrıca JSON endpoint ile backend verilerini de kullanabilirsiniz.

---

## 🌟 Özellikler

- Binadaki tüm dairelerin fiber ve VDSL durumunu kontrol eder
- Tek daire kontrolü (config.json üzerinden daireId girildiğinde)
- Fiber var/yok durumu üst bar ile görsel olarak gösterilir
- Otomatik yenileme (dakika bazlı)
- JSON endpoint ile backend verilerine erişim: `/fiber.json`
- Modern ve şık tablo görünümü, mobil uyumlu
- Kolay kurulum ve yapılandırma

---

## 🏠 Bina ID ve Daire ID

### Bina ID bulmak
1. [AdresKodu DASK](https://adreskodu.dask.gov.tr/) sitesine gidin  
2. Adresinizi girin
3. Açılan adımların 4. adımındaki **bina kodunu** alın  
4. `config.json` içindeki `binaId` alanına yapıştırın

### Daire ID kullanımı
- Eğer sadece tek bir daireyi kontrol etmek istiyorsanız:
  1. İlk sorgulamada daire ID’sini bulun
  2. `config.json` içinde `daireId` alanına girip kaydedin
- Eğer `daireId` boş bırakılırsa, binadaki tüm daireler kontrol edilir

---

## ⏱ Otomatik Yenileme

- `config.json` içindeki `dakika` alanına göre sayfa kendini otomatik yeniler
- Eğer `dakika` değeri **0** ise otomatik yenileme yapılmaz
- Örnek:
```json
{
  "binaId": "xxxxxxxxxx",
  "daireId": "",
  "dakika": 2
}
```

## ⚙️ Kurulum

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/osmancitci/fiber-durum-kontrolu.git
cd fiber-durum-kontrolu
```
### 2. Bağımlılıkları Yükleyin
```bash
npm install
```
### 3. config.json Dosyasını Düzenleyin
```json
{
  "binaId": "xxxxxxxxxx",
  "daireId": "",
  "dakika": 2
}
```
### 4. Sunucuyu Başlatın
```bash
npm start
```
### 5. Tarayıcıdan erişin
```bash
http://localhost:3000
```

## 📌 Önemli Notlar
- binaId ve daireId doğru girilmezse sorgu sonuç vermez
- dakika değeri 0 ise sayfa otomatik yenilenmez
- JSON endpoint tüm verileri backend’den sağlar, frontend tablo bu verilerle oluşturulur

---






