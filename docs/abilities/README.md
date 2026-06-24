# NCF Abilities

Native Custom Fields, WordPress'in WP Abilities API'sini kullanarak AI araçlarına (MCP uyumlu istemciler, REST API) plugin işlevlerini programatik olarak yürütme imkânı tanır. Tüm ability'ler `native-custom-fields` kategorisi altında kayıtlıdır ve `manage_options` yetkisi gerektirir.

## Ability Listesi

| Ability Adı | Açıklama |
|---|---|
| [native-custom-fields/create-post-type](post-type.md) | Yeni özel post tipi oluşturur |
| [native-custom-fields/update-post-type](post-type.md) | Mevcut özel post tipini günceller |
| [native-custom-fields/create-taxonomy](taxonomy.md) | Yeni özel taksonomi oluşturur |
| [native-custom-fields/update-taxonomy](taxonomy.md) | Mevcut özel taksonomiyi günceller |
| [native-custom-fields/save-post-meta-fields](post-meta-fields.md) | Bir post tipine özel alan konfigürasyonu kaydeder |
| [native-custom-fields/save-term-meta-fields](term-meta-fields.md) | Bir taksonomiye özel alan konfigürasyonu kaydeder |
| [native-custom-fields/save-user-meta-fields](user-meta-fields.md) | Kullanıcı profil sayfasına özel alan konfigürasyonu kaydeder |
| [native-custom-fields/create-options-page](options-page.md) | Yeni admin options sayfası oluşturur |
| [native-custom-fields/update-options-page](options-page.md) | Mevcut admin options sayfasını günceller |
| [native-custom-fields/save-options-page-fields](options-page.md) | Bir options sayfasına özel alan konfigürasyonu kaydeder |

## Ortak Özellikler

- **İzin:** Tüm ability'ler `manage_options` WordPress yetkisi gerektirir.
- **MCP:** Tüm ability'ler `mcp.public: true` ile işaretlenmiştir; MCP uyumlu istemcilere açıktır.
- **REST:** Tüm ability'ler `show_in_rest: true` olarak kayıtlıdır.
- **Idempotent:** Tüm ability'ler idempotent'tır; aynı input ile tekrar çalıştırıldığında mevcut kaydı günceller.
- **Destructive:** Hiçbir ability destructive değildir; silme işlemi yapmaz.

## Ortak Output Şeması

Her ability aynı çıktı şemasını döndürür:

```json
{
  "status": true,
  "message": "İşlem başarıyla tamamlandı."
}
```

| Alan | Tip | Açıklama |
|---|---|---|
| `status` | boolean | `true` başarı, `false` hata |
| `message` | string | İşlem sonucu açıklaması veya hata mesajı |

## Alan Şeması (Ortak)

Ability'lerde alan tanımlarken kullanılan ortak şema için [field-schema.md](field-schema.md) dosyasına bakın.
