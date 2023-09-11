# İl, İlçe, Bölge ve Mahalle Bilgisi İçin Rest - API
Bu API [Melih Korkmaz](https://github.com/melihkorkmaz/il-ilce-mahalle-geolocation-rest-api) reposundan klonlanmıştır. API mongo database kullanmaktaydı. Mongodb free servisler fazla olmadığı için veri tabanını mysql olarak düzenledim. Şu anda [Remotemysql](https://remotemysql.com/index.html) üzerindeki veritabanından hizmet vermektedir. Tabiki kaynak koduda mysql kullanımı için değiştirilmiştir. Mysql yedek dosyalarını [buradan](https://drive.google.com/file/d/1f6HhhCEEdCRwrBKwsNo8Dpc0OfBEoU_W/view?usp=sharing) indirebilirsiniz.


Bu API Türkiye'de yer alan il, ilçe ve mahalle bilgilerini içerir. İl ve ilçe bazında geolocation (enlem-boylam, poligon ve boundingbox) bilgileri de yer almaktadır. Mongodb yedek dosyalarını [buradan](https://drive.google.com/file/d/1e6v4S_-BK8Zs43HYBH5ftidBDrHlOZY7/view?usp=sharing) indirebilirsiniz.

## Versiyon 1.1.0 Yenilikler

* Bu versiyonda veri tabanındaki id'ler integer data tipine dönüştürülmüştür. Şehirlerde **id** olarak plaka no kullanılmıştır.
* Hız artışı amacıyla, Tablolardan gelen Lookup **name** bilgileri aynı tablolara gömülmüştür.  
* Neighborhoods tablosu iptal edilmiştir. Bilgilere disctricts tablosu üzerinden ulaşılmaktadır. 
* Veri tabanı başka bir siteye taşınmış ve kullanıcının veritabanına yazma işlemleri mysql üzerinden engellenmiştir.
* **Bu versiyonun** Mysql yedek dosyalarını [buradan](https://drive.google.com/file/d/1PMMDwv1pZJksOsLLDuaGBF_5BNLe9t27/view?usp=sharing) indirebilirsiniz.

## İçindekiler
* [Servis Kullanımı](#service)
    * [rawsql (?rawsql=sql sorgunuz)](#rawsql)
    * [İller (/cities)](#cities)
    * [İlçeler (/towns)](#towns)
    * [Semtler (/districts)](#districts)
    * [Mahalleler (/neighborhoods)](#neighborhoods)
* [Data Model](#dataModel)
    * [İl (City)](#dataModelCity)
    * [İlçe (Town)](#dataModelTown)
    * [Semt (District)](#dataModelDistrict)

## Polygon Nedir
Polygon bir ilin ya da ilçenin sınırlarının enlem ve boylam bilgisini içeren bir grup veridir. Bu bilgi ile bir noktanın o bölge içinde olup olmadığını bilebilir ya da Google Map API ile harita üzerinde gösterebilirsiniz.

![poligon bilgisi](https://image.ibb.co/hS8N8T/Screenshot_from_2018_06_06_12_16_32.png)

<a name="service"></a>
# Servisin Kullanımı
Tüm cevaplar { status : boolean, data : array, err : 'varsa hata' } şablonunda sunulur. Talep etmiş olduğunuz bilgi "data" bölümünde yer almaktadır. Beklenmeyen bir hata bulunduğunda status = false olacaktır.

Kısıtlamalar: Alınan genel sonuçlarda maksimum 100 data servis edilir. Bu sayıyı ?limit=10 diyerek 10'a indirebilirsiniz. Ayrıca ilerideki kayıtlarda yer alan bilgileri almak için ise ?skip=(sayı) şeklinde kullanım yapabilirsiniz.

**Tüm endpointler için query string olarak "fields, skip, limit" kullanılabilir. Fields istenen alanlara karşılık gelmektedir.**

Sıralama City > Towns > Districts > Neighborhoods şeklindedir.  
Sıralama İl > İlçe > Semt > Mahalle şeklindedir.

Servis adresi : https://turkey-geolocation-rest-api.vercel.app/

**Örnek : https://turkey-geolocation-rest-api.vercel.app/cities**  

<a name="search"></a>
## Koordinat Arama (/search/coordinates)
Arama özelliğini kullanarak, servise gönderdiğiniz enlem ve boylam bilgisi karşılığında bu koordinatın hangi ilçe ve ilde olduğunun bilgisini 
alabilirsiniz.

### /search/coordinates?lat=40.340134&lon=27.971170
```
[
    {
        "_id":131,
        "name":"Bandırma",
        "city" : "Balıkesir"
    },
    ...
]
```
<a name="rawsql"></a>
## Rawsql (/?rawsql=)
Veri tabanı üzerinde sql komutlarıyla dilediğiniz gibi okuma yapabilirsiniz. (insert, update, ve bunun gibi veritabanına yazma komutları yasaklanmıştır. Bu tip sorgular çalışmaz)

### /?rawsql=select _id, city, lat, lon from cities where city='İzmir'
SQL sorgusu ile izmir ilinin _id bilgisini ve enlem boylam bilgilerini görebilirsiniz.

```
[
    {
        "_id":35,
        "city":"İzmir",
        "lat":38.23166,
        "lon":27.02997
    }
]
```

<a name="cities"></a>
## İller (/cities)
Toplam 81 il bilgisini json array olarak listeler. Default alanlar sadece _id ve isim bilgisidir.

```
[
    {
        "_id":"34",
        "city":"İstanbul"
    },
    ...
]
```

### /cities?fields=city,lat,lon
Sonuçlar içerisinde gelocationda yer alan enlem boylam bilgisini gösterir. 

```
[
    {
        "_id":34
        "city":"İstanbul",
        "geolocation":{
            "lat":"41.0766019",
            "lon":"29.052495"
        }
    },
    ...
]
```

### /cities?fields=city,towns
İl isimleri ile birlikte o ile ait ilçelerin isim ve id bilgisini listeler.

```
[
    {
        "_id":34,
        "city":"İstanbul",
        "towns":[
            {"_id":421,"name":"Adalar"},
            {"_id":422,"name":"Arnavutköy"},
            ...
        ]
    },
    ...
]
```


### /cities?limit=10
Sadece ilk sırada yer alan 10 şehri listeler.

### /cities?limit=10&skip=20
Yirminci satırdan sonra yer alan 10 şehri listeler.

## /cities/:id
ID'si verilmiş şehir bilgisini döner.

```
{
    "_id":35,
    "name":"İzmir"
}
```

### /cities/:id?fields=city,towns
ID'si verilmiş şehrin isim ve ilçe bilgilerini listeler.
```
{
    "_id":34,
    "city":"İstanbul",
    "towns":[
        {"_id":421,"name":"Adalar"},
        {"_id":422,"name":"Arnavutköy"},
        {"_id":423,"name":"Ataşehir"},
        {"_id":424,"name":"Avcılar"},
        ...
    ]
}
```


-----
<a name="towns"></a>
## İlçeler (/towns)
Tüm ilçeleri json array olarak listeler(max=100). Default alanlar sadece _id, isim ve il bilgisidir.

```
[
    {
        "_id":63,
        "town":"Çamlıdere",
        "city" : "Ankara"
    },
    ...
]
```

### /towns?fields=town,lat,lon
Sonuçlar içerisinde gelocationda yer alan enlem boylam bilgisini gösterir.

```
[
    {
        "_id":443
        "name":"Kadıköy",
        "geolocation":{
            "lat":"41.0766019",
            "lon":"29.052495"
        }
    },
    ...
]
```

### /towns?fields=_id,town,districts
İlçe isimleri ile birlikte o ilçeye ait semtlerin isim ve id bilgisini listeler.

```
[
    {
        "_id":443,
        "name":"Kadıköy",
        "districts":[
            {"_id":1757,"name":"Bostancı"},
            {"_id":1758,"name":"Caddebostan"},
            {"_id":1759,"name":"Caferağa"}
            ...
        ]
    },
    ...
]
```

### /towns?limit=10
Sadece ilk sırada yer alan 10 ilçeyi listeler.

### /towns?limit=10&skip=20
Yirminci kayıttan sonrasında yer alan 10 ilçeyi listeler.

## /towns/:id
ID'si verilmiş ilçe bilgisini döner.

```
{
    "_id":443,
    "name":"Kadıköy",
    "city": "İstanbul"
}
```

### /towns/:id?fields=name,districts
ID'si verilmiş ilçenin isim ve semt bilgilerini listeler.
```
{
    "_id":443,
    "name":"Kadıköy",
    "districts":[
        {"_id":1757,"name":"Bostancı"},
        {"_id":1758,"name":"Caddebostan"},
        {"_id":1759,"name":"Caferağa"}
        ...
    ]
}
```


-----
<a name="districts"></a>
## Semtler (/districts)
Tüm semtleri json array olarak listeler(max=100). Default alanlar sadece _id, district, ilçe ve il bilgisidir.

```
[
    {
        "_id":1763,
        "district":"Feneryolu",
        "town" : "Kadıköy",
        "city" : "İstanbul"
    },
    ...
]
```

### /districts?fields=_id,district
Sonuçlar içerisinde sadece _id ve district bilgisi yer alır

### /districts?fields=_id,district,neighborhoods
Semt isimleri ile birlikte o semte ait mahalle isim ve id bilgisini listeler.

```
[
    {
        "_id":1763,
        "district":"Feneryolu",
        "neighborhoods":[
            {"_id":53504,"name":"Feneryolu mah"},
            {"_id":53505,"name":"Zühtüpaşa mah"},
            ...
        ]
    },
    ...
]
```

### /districts?limit=10
Sadece ilk sırada yer alan 10 semti listeler.

### /districts?limit=10&skip=20
Yirminci kayıtdan sonrasında yer alan 10 semti listeler.

## /districts/:id
ID'si verilmiş semt bilgisini döner.

```
{
    "_id":1763,
    "district":"Feneryolu",
    "town":"Kadıköy",
    "city":"İstanbul"
}
```

### /districts/:id?fields=district,neighborhoods,zip_code
ID'si verilmiş semtin isim ve mahalle bilgilerini listeler ve semtin posta kodunu görüntüler.
```
{
    "_id":1763,
    "district":"Feneryolu",
    "neighborhoods":[
        {"_id":53504,"name":"Feneryolu mah"},
        {"_id":53505,"name":"Zühtüpaşa mah"},
        ...
    ],
    "zip_code":34724
}
```


-----
<a name="neighborhoods"></a>
## Mahalleler (/neighborhoods)
Tüm mahalleleri json array olarak listeler(max=100). Default alanlar _id, isim, semt, ilçe, il ve posta kodu bilgisidir.

```
[
    {
        "_id":53504,
        "name":"Feneryolu mah",
        "district":"Feneryolu",
        "town":"Kadıköy",
        "city":"İstanbul",
        "zip_code":"34724"
    },
    ...
]
```

### /neighborhoods?fields=neighborhoods
Sonuçlar içerisinde sadece id ve name bilgisi yer alır

### /neighborhoods?limit=10
Sadece ilk sırada yer alan 10 mahalleyi listeler.

### /neighborhoods?limit=10&skip=20
Yirminci kayıtdan sonrasında yer alan 10 semti listeler.

## /neighborhoods/:id
ID'si verilmiş mahalle bilgisini döner.

```
{
    "_id":53504,
    "name":"Feneryolu mah",
    "district":"Feneryolu",
    "town":"Kadıköy",
    "city":"İstanbul",
    "zip_code":"34724"
}
```

-----

<a name="dataModel"></a>
## Data Model

<a name="dataModelCity"></a>
### İl (City)
| Alan | Tip | Açıklama |
| ------ | ------ | ------ |
| _id | string | Şehir id|
| city | string | Şehir ismi |
| towns | array | İlçe id listesi |
| lat | double | Şehir Enlem bilgisi |
| lon | double | Şehir Boylam bilgisi |
| Polygons | geometri | Şehir sınırları bilgisi |
| boundingbox | array | Şehri sınırlayan çerçeve |


<a name="dataModelTown"></a>
### İlçe (Town)
| Alan | Tip | Açıklama |
| ------ | ------ | ------ |
| _id | string | İlçe id|
| town | string | İlçe ismi |
| city | string | Şehir ismi |
| districts | array | Semt id listesi |
| boundingbox | array | İlçeyi sınırlayan çerçeve |
| lat | double | İlçe Enlem bilgisi |
| lon | double | İlçe Boylam bilgisi |
| Polygons | geometri | İlçe sınırları bilgisi |
| boundingbox | array | İlçeyi sınırlayan çerçeve |


<a name="dataModelDistrict"></a>
### Semt (District)
| Alan | Tip | Açıklama |
| ------ | ------ | ------ |
| _id | string | Semt id|
| district | string | Semt ismi |
| city | string | Şehir ismi |
| town | string | İlçe ismi |
| neighborhoods | array | Mahalle id listesi |
| zip_code | mediumint | Posta Kodu |


Lisans
-------

    MIT License

    Copyright (c) 2018 Ramazan Demircioğlu

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
