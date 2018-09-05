# kintone-customize-uploader
A kintone customize uploader using [request-promise](https://github.com/request/request-promise)

## Usage
```
% npm install kintone-customize-uploader
% ./node_modules/.bin/kintone-customize-uploader
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
${manifestFile}
```

or

```
% npm install -g kintone-customize-uploader
% kintone-customize-uploader \
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
${manifestFile}
```

If you want to upload the customize files automatically when a file is updated, you can use `--watch` option.

```
% kintone-customize-uploader \
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
--watch \
${manifestFile}
```

## Options
```
  Usage
    $ kintone-customize-uploader <manifestFile>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --proxy Proxy server
    --watch Watch the changes of customize files and re-run
    --waiting-dialog-ms A ms for waiting show a input dialog
    --lang Using language (en or ja)
    --guest-space-id Guest space ID for uploading files
    You can set the values through environment variables
    domain: KINTONE_DOMAIN
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    proxy: HTTPS_PROXY or HTTP_PROXY
```

If you omit the options, you can input the options interactively.
```
% kintone-customize-uploader manifest.json
? Input your username: hoge
? Input your password: [hidden]
? Input your domain: example.com
```

## LICENSE
MIT License