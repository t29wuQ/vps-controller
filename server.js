const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.static('views'));

// ルート（http://localhost/）にアクセスしてきたときに「Hello」を返す
app.get('/', (req, res) => res.sendFile('/views/index.html'));

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('Listening on port 3000'));