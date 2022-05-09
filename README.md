# İl, İlçe, Bölge ve Mahalle Bilgisi İçin Rest - API
Bu API [Melih Korkmaz](https://github.com/melihkorkmaz/il-ilce-mahalle-geolocation-rest-api) reposundan klonlanmıştır. API mongo database kullanmaktaydı. Mongodb free servisler fazla olmadığı için veri tabanını mysql olarak düzenledim. Şu anda [Remotemysql](https://remotemysql.com/index.html) üzerindeki veritabanından hizmet vermektedir. Tabiki kaynak koduda mysql kullanımı için değiştirilmiştir. Mysql yedek dosyalarını [buradan](https://drive.google.com/file/d/1f6HhhCEEdCRwrBKwsNo8Dpc0OfBEoU_W/view?usp=sharing) indirebilirsiniz.


Bu API Türkiye'de yer alan il, ilçe ve mahalle bilgilerini içerir. İl ve ilçe bazında geolocation (enlem-boylam, poligon ve boundingbox) bilgileri de yer almaktadır. Mongodb yedek dosyalarını [buradan](https://drive.google.com/file/d/1e6v4S_-BK8Zs43HYBH5ftidBDrHlOZY7/view?usp=sharing) indirebilirsiniz.


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
    * [Mahalle (Neighborhood)](#dataModelNeighborhood)

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

Servis adresi : https://il-ilce-rest-api.herokuapp.com/v1

**Örnek : https://il-ilce-rest-api.herokuapp.com/v1/cities**  

<a name="search"></a>
## Koordinat Arama (/search/coordinates)
Arama özelliğini kullanarak, servise gönderdiğiniz enlem ve boylam bilgisi karşılığında bu koordinatın hangi ilçe ve ilde olduğunun bilgisini 
alabilirsiniz.

### /search/coordinates?lat=40.340134&lon=27.971170
```
[
    {
        "_id":"ce941560c5a7ba9ff5cd24f5f9d75065",
        "name":"Bandırma",
        "city" : "Balıkesir"
    },
    ...
]
```
<a name="rawsql"></a>
## Rawsql (/?rawsql=)
Veri tabanı üzerinde sql komutlarıyla dilediğiniz gibi okuma yapabilirsiniz. (insert, update, ve bunun gibi veritabanına yazma komutları yasaklanmıştır. Bu tip sorgular çalışmaz)

### /?rawsql=select _id, name, lat, lon from cities where name='İzmir'
SQL sorgusu ile izmir ilinin _id bilgisini ve enlem boylam bilgilerini görebilirsiniz.

```
[
    {
        "_id":"41585da49f8b3330c12e64b11b0195b4",
        "name":"İzmir",
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
        "_id":"ce941560c5a7ba9ff5cd24f5f9d75065",
        "name":"İstanbul"
    },
    ...
]
```

### /cities?fields=name,lat,lon
Sonuçlar içerisinde gelocationda yer alan enlem boylam bilgisini gösterir. 

```
[
    {
        "_id":"ce941560c5a7ba9ff5cd24f5f9d75065"
        "name":"İstanbul",
        "geolocation":{
            "lat":"41.0766019",
            "lon":"29.052495"
        }
    },
    ...
]
```

### /cities?fields=name,towns
İl isimleri ile birlikte o ile ait ilçelerin isim ve id bilgisini listeler.

```
[
    {
        "_id":"ce941560c5a7ba9ff5cd24f5f9d75065",
        "name":"İstanbul",
        "towns":[
            {"_id":"fc74d991616e5931e47ef849ae54e8c2","name":"Adalar"},
            {"_id":"66cd91880b422fa267b41e1777d5d271","name":"Arnavutköy"},
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
    "_id":"ce941560c5a7ba9ff5cd24f5f9d75065",
    "name":"İstanbul"
}
```

### /cities/:id?fields=name,towns
ID'si verilmiş şehrin isim ve ilçe bilgilerini listeler.
```
{
    "_id":"ce941560c5a7ba9ff5cd24f5f9d75065",
    "name":"İstanbul",
    "towns":[
        {"_id":"fc74d991616e5931e47ef849ae54e8c2","name":"Adalar"},
        {"_id":"66cd91880b422fa267b41e1777d5d271","name":"Arnavutköy"},
        {"_id":"b17dd334e97c22173275812f47d4a8c2","name":"Ataşehir"},
        {"_id":"4b0fa2e031d02d08a559fbff728b456d","name":"Avcılar"},
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
        "_id":"bccdf16204b5a81620ed39c8c69930ea",
        "name":"Kadıköy",
        "city" : "İstanbul"
    },
    ...
]
```

### /towns?fields=name,lat,lon
Sonuçlar içerisinde gelocationda yer alan enlem boylam bilgisini gösterir.

```
[
    {
        "_id":"bccdf16204b5a81620ed39c8c69930ea"
        "name":"Kadıköy",
        "geolocation":{
            "lat":"41.0766019",
            "lon":"29.052495"
        }
    },
    ...
]
```

### /towns?fields=name,districts
İlçe isimleri ile birlikte o ilçeye ait semtlerin isim ve id bilgisini listeler.

```
[
    {
        "_id":"bccdf16204b5a81620ed39c8c69930ea",
        "name":"Kadıköy",
        "districts":[
            {"_id":"19136811a8b89351660117988aaab257","name":"Bostancı"},
            {"_id":"d7d8dfc31ec4fe72d6383a0393df7235","name":"Caddebostan"},
            {"_id":"1ce31e4e97cb908b3655f893661e4f1b","name":"Caferağa"}
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
    "_id":"bccdf16204b5a81620ed39c8c69930ea",
    "name":"Kadıköy",
    "city": "İstanbul"
}
```

### /towns/:id?fields=name,districts
ID'si verilmiş ilçenin isim ve semt bilgilerini listeler.
```
{
    "_id":"bccdf16204b5a81620ed39c8c69930ea",
    "name":"Kadıköy",
    "districts":[
        {"_id":"19136811a8b89351660117988aaab257","name":"Bostancı"},
        {"_id":"d7d8dfc31ec4fe72d6383a0393df7235","name":"Caddebostan"},
        {"_id":"1ce31e4e97cb908b3655f893661e4f1b","name":"Caferağa"}
        ...
    ]
}
```


-----
<a name="districts"></a>
## Semtler (/districts)
Tüm semtleri json array olarak listeler(max=100). Default alanlar sadece _id, isim, ilçe ve il bilgisidir.

```
[
    {
        "_id":"dbd0266fcc4d225809c6c6669aa2046a",
        "name":"Feneryolu",
        "town" : "Kadıköy",
        "city" : "İstanbul"
    },
    ...
]
```

### /districts?fields=name
Sonuçlar içerisinde sadece _id ve name bilgisi yer alır

### /districts?fields=name,neighborhoods
Semt isimleri ile birlikte o semte ait mahalle isim ve id bilgisini listeler.

```
[
    {
        "_id":"dbd0266fcc4d225809c6c6669aa2046a",
        "name":"Feneryolu",
        "neighborhoods":[
            {"_id":"799df51fbdb9624b9274b01bd072d749","name":"Feneryolu mah"},
            {"_id":"b588445717478e1a47892e70b44325ac","name":"Zühtüpaşa mah"},
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
    "_id":"dbd0266fcc4d225809c6c6669aa2046a",
    "name":"Feneryolu",
    "town":"Kadıköy",
    "city":"İstanbul"
}
```

### /districts/:id?fields=name,neighborhoods
ID'si verilmiş semtin isim ve mahalle bilgilerini listeler.
```
{
    "_id":"dbd0266fcc4d225809c6c6669aa2046a",
    "name":"Feneryolu",
    "neighborhoods":[
        {"_id":"799df51fbdb9624b9274b01bd072d749","name":"Feneryolu mah"},
        {"_id":"b588445717478e1a47892e70b44325ac","name":"Zühtüpaşa mah"},
        ...
    ]
}
```


-----
<a name="neighborhoods"></a>
## Mahalleler (/neighborhoods)
Tüm mahalleleri json array olarak listeler(max=100). Default alanlar _id, isim, semt, ilçe, il ve posta kodu bilgisidir.

```
[
    {
        "_id":"799df51fbdb9624b9274b01bd072d749",
        "name":"Feneryolu mah",
        "district":"Feneryolu",
        "town":"Kadıköy",
        "city":"İstanbul",
        "zip_code":"34724"
    },
    ...
]
```

### /neighborhoods?fields=name
Sonuçlar içerisinde sadece name bilgisi yer alır

### /neighborhoods?limit=10
Sadece ilk sırada yer alan 10 mahalleyi listeler.

### /neighborhoods?limit=10&skip=20
Yirminci kayıtdan sonrasında yer alan 10 semti listeler.

## /neighborhoods/:id
ID'si verilmiş mahalle bilgisini döner.

```
{
    "_id":"799df51fbdb9624b9274b01bd072d749",
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
| name | string | Şehir ismi |
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
| city | string | Şehir ismi |
| districts | array | Semt id listesi |
| boundingbox | array | İlçeyi sınırlayan çerçeve |
| lat | double | İlçe Enlem bilgisi |
| lon | double | İlçe Boylam bilgisi |
| Polygons | geometri | İlçe sınırları bilgisi |
| name | string | İlçe ismi |


<a name="dataModelDistrict"></a>
### Semt (District)
| Alan | Tip | Açıklama |
| ------ | ------ | ------ |
| _id | string | Semt id|
| city | string | Şehir ismi |
| name | string | Semt ismi |
| neighborhoods | array | Mahalle id listesi |
| town | string | İlçe ismi |


<a name="dataModelNeighborhood"></a>
### Mahalle (Neighborhood)
| Alan | Tip | Açıklama |
| ------ | ------ | ------ |
| _id | string | Mahalle id|
| city | string | Şehir ismi |
| district | string | Semt ismi |
| name | string | Mahalle ismi |
| town | string | İlçe ismi |
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
