//import packages
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const alert = require("alert");

//initialize the app as an express app
const app = express();
const router = express.Router();
const path = require('path');
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const { table } = require("console");
app.use("/images", express.static("images"));

//Insiasi koneksi ke database (AZURE DATABASE)
const db = new Client({
  user: "railway_database",
  host: "railway-database.postgres.database.azure.com",
  database: "railway_database",
  password: "SBD 8 w FS",
  prot: 5432,
  sslmode: "require",
  ssl: true,
});

//Melakukan koneksi dan menunjukkan indikasi database terhubung
db.connect((err) => {
  if (err) {
    console.log(err + "Database not connected");
    return;
  }
  console.log("Database berhasil terkoneksi");
});

//jalankan koneksi ke database

//middleware (session)
app.use(
  session({
    secret: "ini contoh secret",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var temp;

//Halaman untuk umum (home page) menampilkan informasi rute join table kereta, stasiun, dan tarif
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/home.html"));
});

//Halaman untuk umum menampilkan table kereta
router.get("/kereta", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/kereta.html"));
});

//Halaman untuk umun menampilkan table stasiun
router.get("/stasiun", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/stasiun.html"));
});

//Halaman untuk Login
router.get("/loginpage", (req, res) => {
  temp = req.session;
  if (temp.username) {
    //jika admin terdaftar maka akan masuk ke halaman admin
    return res.redirect("/admin");
  } else {
    //jika admin belum login maka akan masuk ke halaman login
    res.sendFile(path.join(__dirname + "/frontend/loginpage.html"));
  }
});

//Halam utama admin, untuk operasi CRUD table RUTE
router.get("/admin", (req, res) => {
  temp = req.session;
  if (temp.username) {
    //jika user terdaftar maka akan masuk ke halaman admin
    res.sendFile(path.join(__dirname + "/frontend/editrute.html"));
    //mengarahkan ke halaman login
  } else {
    res.sendFile(path.join(__dirname + "/frontend/loginpage.html"));
  }
});

//front-end untuk admin operasi CRUD TABLE STASIUN
router.get("/editstasiun", function (req, res, next) {
  temp = req.session;
  if (temp.username) {
    res.sendFile(path.join(__dirname + "/frontend/editstasiun.html"));
    //mengarahkan ke halaman login
  } else {
    res.sendFile(path.join(__dirname + "/frontend/loginpage.html"));
  }
});

//Front-End untuk Admin operasi CRUD table Kereta
router.get("/editkereta", function (req, res, next) {
  temp = req.session;
  if (temp.username) {
    res.sendFile(path.join(__dirname + "/frontend/editkereta.html"));
    //Mengarahkan ke halaman login
  } else {
    res.sendFile(path.join(__dirname + "/frontend/loginpage.html"));
  }
});

//Front-end halaman admin untuk operasi CRUD table tarif
router.get("/tarif", function (req, res, next) {
  temp = req.session;
  if (temp.username) {
    res.sendFile(path.join(__dirname + "/frontend/edittarif.html"));
    //Mengarahkan ke halaman login
  } else {
    res.sendFile(path.join(__dirname + "/frontend/loginpage.html"));
  }
});

//Front-End untuk halaman edit data admin (Operasi CRUD)
router.get("/editadmin", function (req, res, next) {
  temp = req.session;
  if (temp.username) {
    db.query(
      `select super_admin from admin where username = '${temp.username}'`,
      function (err, result) {
        if (result.rows[0].super_admin == true) {
          res.sendFile(path.join(__dirname + "/frontend/admin.html"));
          //Jika Bukan Super Admin, tidak dapat mengakses /editadmin
        } else {
          res.sendFile(path.join(__dirname + "/frontend/notadmin.html"));
        }
      }
    );

    //Mengarahkan ke halaman login jika belum login atau session habis
  } else {
    res.sendFile(path.join(__dirname + "/frontend/loginpage.html"));
  }
});

//Menampilkan view daftar_rute dari database berisi informasi rute, tarif, nama stasiun, dan nama kereta
router.post("/getdata", (req, res) => {
  const query = "SELECT * from daftar_rute;"; // query ambil data
  //mendapatkan data dari database
  db.query(query, (err, results) => {
    if (err) {
      console.log(err)
      return;
    }
    res.write(`<table>
      <tr>
          <th scope="col">Nomor Rute</th>
          <th scope="col">Nama Kereta</th>
          <th scope="col">Harga</th>
          <th scope="col">Stasiun Keberangkatan</th>
          <th scope="col">Waktu Keberangkatan</th>
          <th scope="col">Stasiun Tujuan</th>
          <th scope="col">Waktu Tiba</th>
      </tr>`);
    for (row of results.rows) {
      res.write(`<tr>
                      <td>${row["no_rute"]}</td>
                      <td>${row["nama_kereta"]}</td>
                      <td>${row["harga"]}</td>
                      <td>${row["stasiun_keberangkatan"]}</td>
                      <td>${row["waktu_berangkat"]}</td>
                      <td>${row["stasiun_tiba"]}</td>
                      <td>${row["waktu_tiba"]}</td>
                  </tr>`);
    }
    res.end(`</tbody>
      </table>`);
  });
});

//Back-end untuk Table Tarif
//menampilkan table tarif
router.post("/gettarif", (req, res) => {
  const query = "select * from tarif;"; // query ambil data
  //mendapatkan data dari database
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.write(`<table>
    <tr>
      <th scope="col">ID TARIF</th>
      <th scope="col">ID RUTE</th>
      <th scope="col">HARGA</th>
    </tr>`);
    for (row of results.rows) {
      res.write(`<tr>
                    <td>${row["id_tarif"]}</td>
                    <td>${row["id_rute"]}</td>
                    <td>${row["harga"]}</td>
                </tr>`);
    }
    res.end(`</tbody>
    </table>`);
  });
});

//input data baru ke table tarif
router.post("/inputtarif", (req, res) => {
  var id_rute = req.body.id_rute;
  var harga = req.body.harga;

  if (id_rute.length > 0 && harga.length > 0) {
    const query = `insert into tarif (id_rute,harga) values ('${id_rute}','${harga}');`; //query tambahkan user baru ke database
    db.query(query, (err, results) => {
      if (err) {
        res.end("fail");
      }
      res.end("done");
    });
  } else {
    res.end("empty");
  }
});

//update atau mengubah isi table tarif
router.post("/updatetarif", (req, res) => {
  var id_tarif = req.body.id_tarif;
  var id_rute = req.body.id_rute;
  var harga = req.body.harga;
  if (id_rute && harga) {
    const query = `update tarif set id_rute = ${id_rute}, harga = ${harga} where id_tarif = ${id_tarif};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (harga) {
    const query = `update tarif set harga = ${harga} where id_tarif = ${id_tarif};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (id_rute) {
    const query = `update tarif set id_rute = ${id_rute} where id_tarif = ${id_tarif};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else {
    res.end("empty");
  }
});

//Delete data dari table tarif
router.post("/deletetarif", (req, res) => {
  var id_tarif = req.body.id_tarif;

  const query = `delete from tarif where id_tarif = ${id_tarif};`;
  if (id_tarif.length > 0) {
    db.query(query, (err, results) => {
      if (results) {
        res.send("deleted");
      } else {
        res.send("failed");
      }
    });
  } else {
    res.end("empty");
  }
});

router.post('/cekusername' , (req, res) => {
  var username = req.body.username;
  console.log(username);
  const query = `select username from admin where username like '${username}'`;
  db.query(query, (err, results) => {
    if (results.rowCount > 0) {
      res.end("taken");
    } else {
      res.end("not_taken");
    }
  });
});
//Cek ID Tarif
router.post("/cektarif", (req, res) => {
  var id_tarif = req.body.id_tarif;
  const query = `select * from tarif where id_tarif = '${id_tarif}';`;
  if (id_tarif) {
    db.query(query, (err, results) => {
      if (results.rowCount > 0) {
        res.end("found");
      } else {
        res.end("notfound");
      }
    });
  } else {
    res.end("empty");
  }
});

//Back-end untuk Table Stasiun
//menampilkan table stasiun
router.post("/getstasiun", (req, res) => {
  const query = "select * from stasiun;"; // query ambil data
  //mendapatkan data dari database
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.write(`<table>
    <tr>
        <th scope="col">Nomor Stasiun</th>
        <th scope="col">Nama Stasiun</th>
        <th scope="col">Daerah Stasiun</th>
        <th scope="col">Tanggal Dibangun</th>
    </tr>`);
    for (row of results.rows) {
      var dateOnly = new Date(row["tahun_bangun"]).toLocaleDateString();
      row["tahun_bangun"] = dateOnly;
      res.write(`<tr>
                    <td>${row["id_stasiun"]}</td>
                    <td>${row["nama_stasiun"]}</td>
                    <td>${row["daerah_stasiun"]}</td>
                    <td>${row["tahun_bangun"]}</td>
                </tr>`);
    }
    res.end(`</tbody>
    </table>`);
  });
});

//Input data baru ke table stasiun
router.post("/inputstasiun", (req, res) => {
  var nama_stasiun = req.body.nama_stasiun;
  var daerah_stasiun = req.body.daerah_stasiun;
  var tahun_dibangun = req.body.tahun_dibangun;

  if (
    nama_stasiun.length > 0 &&
    daerah_stasiun.length &&
    tahun_dibangun.length > 0
  ) {
    const query = `insert into stasiun (nama_stasiun,daerah_stasiun,tahun_bangun) values ('${nama_stasiun}','${daerah_stasiun}','${tahun_dibangun}');`; //query tambahkan user baru ke database
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("done");
    });
  } else {
    res.end("empty");
  }
});

//Update data dari table stasiun
router.post("/updatestasiun", (req, res) => {
  var id_stasiun = req.body.id_stasiun;
  var nama_stasiun = req.body.nama_stasiun;
  var daerah_stasiun = req.body.daerah_stasiun;
  var tahun_bangun = req.body.tahun_bangun;

  if (nama_stasiun && daerah_stasiun && tahun_bangun) {
    const query = `update stasiun set nama_stasiun = '${nama_stasiun}', daerah_stasiun = '${daerah_stasiun}', tahun_bangun = '${tahun_bangun}' where id_stasiun = ${id_stasiun};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (nama_stasiun && daerah_stasiun) {
    const query = `update stasiun set nama_stasiun = '${nama_stasiun}', daerah_stasiun = '${daerah_stasiun}' where id_stasiun = ${id_stasiun};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (nama_stasiun && tahun_bangun) {
    const query = `update stasiun set nama_stasiun = '${nama_stasiun}', tahun_bangun = '${tahun_bangun}' where id_stasiun = ${id_stasiun};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (daerah_stasiun && tahun_bangun) {
    const query = `update stasiun set daerah_stasiun = '${daerah_stasiun}', tahun_bangun = '${tahun_bangun}' where id_stasiun = ${id_stasiun};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (nama_stasiun) {
    const query = `update stasiun set nama_stasiun = '${nama_stasiun}' where id_stasiun = ${id_stasiun};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (daerah_stasiun) {
    const query = `update stasiun set daerah_stasiun = '${daerah_stasiun}' where id_stasiun = ${id_stasiun};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else if (tahun_bangun) {
    const query = `update stasiun set tahun_bangun = '${tahun_bangun}' where id_stasiun = ${id_stasiun};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  } else {
    res.send("empty");
  }
});

//Delete data dari table stasiun
router.post("/deletestasiun", (req, res) => {
  var id_stasiun = req.body.id_stasiun;
  const query = `delete from stasiun where id_stasiun = ${id_stasiun};`;
  db.query(query, (err, results) => {
    if (results) {
      res.send("deleted");
    } else {
      res.send("failed");
    }
  });
});

//CEK ID STASIUN
router.post("/cekstasiun", (req, res) => {
  var id_stasiun = req.body.id_stasiun;
  const query = `select * from stasiun where id_stasiun = ${id_stasiun};`;
  if (id_stasiun) {
    db.query(query, (err, results) => {
      if (results.rowCount > 0) {
        res.send("found");
      } else {
        res.send("notfound");
      }
    });
  } else {
    res.send("empty");
  }
});

//Back-end untuk Table Rute
//menampilkan table rute
router.post("/getrute", (req, res) => {
  const query = "select * from rute;"; // query ambil data
  //mendapatkan data dari database
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.write(`<table>
    <tr>
      <th scope="col">ID RUTE</th>
      <th scope="col">ID KERETA</th>
      <th scope="col">ID STASIUN KEBERANGKATAN</th>
      <th scope="col">WAKTU KEBERANGKATAN</th>
      <th scope="col">ID STASIUN TUJUAN</th>
      <th scope="col">WAKTU TIBA</th>
      <th scope="col">JARAK</th>
    </tr>`);
    for (row of results.rows) {
      res.write(`<tr>
                    <td>${row["id_rute"]}</td>
                    <td>${row["id_kereta"]}</td>
                    <td>${row["id_stasiun_berangkat"]}</td>
                    <td>${row["waktu_berangkat"]}</td>
                    <td>${row["id_stasiun_tiba"]}</td>
                    <td>${row["waktu_tiba"]}</td>
                    <td>${row["jarak"]}</td>
                </tr>`);
    }
    res.end(`</tbody>
    </table>`);
  });
});

//Input data baru ke table rute
router.post("/inputrute", (req, res) => {
  var id_kereta = req.body.id_kereta;
  var id_stasiun_ber = req.body.stasiun_ber;
  var waktu_ber = req.body.waktu_ber;
  var id_stasiun_tib = req.body.stasiun_tib;
  var waktu_tib = req.body.waktu_tib;
  var jarak = req.body.jarak;
  console.log(id_kereta, id_stasiun_ber, waktu_ber, id_stasiun_tib, waktu_tib, jarak);
  if (
    id_kereta &&
    id_stasiun_ber &&
    waktu_ber &&
    id_stasiun_tib &&
    waktu_tib &&
    jarak
  ) {
    const query = `insert into rute (id_kereta, id_stasiun_berangkat, waktu_berangkat, id_stasiun_tiba, waktu_tiba, jarak) values ('${id_kereta}','${id_stasiun_ber}','${waktu_ber}','${id_stasiun_tib}','${waktu_tib}', '${jarak}');`; //query tambahkan user baru ke database
    db.query(query, (err, results) => {
      if (results) {
        res.end("done");
      } else {
        res.end("fail");
      }
    });
  } else {
    res.end("empty");
  }
});

//Update data dari table rute
router.post("/updaterute", (req, res) => {
  var id_rute = req.body.id_rute;
  var id_kereta = req.body.ker;
  var id_stasiun_ber = req.body.sber;
  var waktu_ber = req.body.wber;
  var id_stasiun_tib = req.body.stuj;
  var waktu_tib = req.body.wtib;
  var jarak = req.body.jar;
  console.log(id_rute + 'idrute');
  console.log(id_kereta + 'idkereta');
  console.log(id_stasiun_ber + 'idstasiunber');
  console.log(waktu_ber + 'waktuber');
  console.log(id_stasiun_tib + 'idstasiuntib');
  console.log(waktu_tib + 'waktu tib');
  console.log(jarak + 'jarak');

  if (id_kereta && id_stasiun_ber && waktu_ber && id_stasiun_tib && waktu_tib && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_ber && waktu_ber && id_stasiun_tib && waktu_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    }
    );
  }
  else if (id_kereta && id_stasiun_ber && waktu_ber && id_stasiun_tib && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_ber && waktu_ber && waktu_tib && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_ber && id_stasiun_tib && waktu_tib && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && waktu_ber && id_stasiun_tib && waktu_tib && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && waktu_ber && id_stasiun_tib && waktu_tib && jarak) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && id_stasiun_ber && waktu_ber && id_stasiun_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && id_stasiun_ber && waktu_ber && waktu_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && id_stasiun_ber && waktu_ber && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && id_stasiun_ber && id_stasiun_tib && waktu_tib){
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && id_stasiun_ber && id_stasiun_tib && jarak){
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && id_stasiun_ber && waktu_tib && jarak){
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && waktu_ber && id_stasiun_tib && waktu_tib){
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && waktu_ber && id_stasiun_tib && jarak){
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && waktu_ber && waktu_tib && jarak){
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_kereta && id_stasiun_tib && waktu_tib && jarak){
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_stasiun_ber && waktu_ber && id_stasiun_tib && waktu_tib){
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_stasiun_ber && waktu_ber && id_stasiun_tib && jarak){
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_stasiun_ber && waktu_ber && waktu_tib && jarak){
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(id_stasiun_ber && id_stasiun_tib && waktu_tib && jarak){
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(waktu_ber && id_stasiun_tib && waktu_tib && jarak){
    const query = `update rute set waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }

  else if (id_kereta && id_stasiun_ber && waktu_ber) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_ber && id_stasiun_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_ber && waktu_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_ber && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && waktu_ber && id_stasiun_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && waktu_ber && waktu_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && waktu_ber && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_tib && waktu_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_tib && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && waktu_tib && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && waktu_ber && id_stasiun_tib) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && waktu_ber && waktu_tib) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && waktu_ber && jarak) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && id_stasiun_tib && waktu_tib) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && id_stasiun_tib && jarak) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && waktu_tib && jarak) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_ber && id_stasiun_tib && waktu_tib) {
    const query = `update rute set waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if(waktu_ber && id_stasiun_tib && jarak) {
    const query = `update rute set waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_ber && waktu_tib && jarak) {
    const query = `update rute set waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_tib && waktu_tib && jarak) {
    const query = `update rute set id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_ber) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_berangkat = '${id_stasiun_ber}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && waktu_ber) {
    const query = `update rute set id_kereta = '${id_kereta}', waktu_berangkat = '${waktu_ber}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && id_stasiun_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && waktu_tib) {
    const query = `update rute set id_kereta = '${id_kereta}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta && jarak) {
    const query = `update rute set id_kereta = '${id_kereta}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && waktu_ber) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_berangkat = '${waktu_ber}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && id_stasiun_tib) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && waktu_tib) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber && jarak) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_ber && id_stasiun_tib) {
    const query = `update rute set waktu_berangkat = '${waktu_ber}', id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_ber && waktu_tib) {
    const query = `update rute set waktu_berangkat = '${waktu_ber}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_ber && jarak) {
    const query = `update rute set waktu_berangkat = '${waktu_ber}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_tib && waktu_tib) {
    const query = `update rute set id_stasiun_tiba = '${id_stasiun_tib}', waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_tib && jarak) {
    const query = `update rute set id_stasiun_tiba = '${id_stasiun_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_tib && jarak) {
    const query = `update rute set waktu_tiba = '${waktu_tib}', jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_kereta) {
    const query = `update rute set id_kereta = '${id_kereta}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_ber) {
    const query = `update rute set id_stasiun_berangkat = '${id_stasiun_ber}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_ber) {
    const query = `update rute set waktu_berangkat = '${waktu_ber}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (id_stasiun_tib) {
    const query = `update rute set id_stasiun_tiba = '${id_stasiun_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (waktu_tib) {
    const query = `update rute set waktu_tiba = '${waktu_tib}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else if (jarak) {
    const query = `update rute set jarak = '${jarak}' where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results) {
        res.send("updated");
      } else {
        res.send("failed");
      }
    });
  }
  else {
    res.send("empty");
  }
});

//Delete data dari table rute
router.post("/deleterute", (req, res) => {
  var id_rute = req.body.id_rute;
  console.log(id_rute + "delet");
  const query = `delete from rute where id_rute = ${id_rute};`;
  db.query(query, (err, results) => {
    if (results) {
      res.send("deleted");
    } else {
      res.send("failed");
    }
  });
});

//cek id rute
router.post("/cekrute", (req, res) => {
  var id_rute = req.body.id_rute;
  if (id_rute) {
    const query = `select * from rute where id_rute = ${id_rute};`;
    db.query(query, (err, results) => {
      if (results.rowCount > 0) {
        res.send("found");
      } else {
        res.send("notfound");
      }
    });
  } else {
    res.send("empty");
  }
});

//Back-end untuk Table Kereta
//menampilkan table kereta
router.post("/getkereta", (req, res) => {
  const query = "select * from kereta;"; // query ambil data
  //mendapatkan data dari database
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.write(`<table>
      <tr>
          <th scope="col">Nomor Kereta</th>
          <th scope="col">Nama Kereta</th>
          <th scope="col">Kapasitas Penumpang</th>
          <th scope="col">Tanggal Pembuatan</th>
          <th scope="col">Tanggal Beroperasi</th>
      </tr>`);
    for (row of results.rows) {
      var date = new Date(row["tahun_buat"]).toDateString();
      var dateOnly = new Date(row["tahun_aktif"]).toLocaleDateString();
      row["tahun_buat"] = date;
      row["tahun_aktif"] = dateOnly;
      res.write(`<tr>
                      <td>${row["id_kereta"]}</td>
                      <td>${row["nama_kereta"]}</td>
                      <td>${row["kapasitas_kereta"]}</td>
                      <td>${row["tahun_buat"]}</td>
                      <td>${row["tahun_aktif"]}</td>
                  </tr>`);
    }
    res.end(`</tbody>
      </table>`);
  });
});

//Input data baru ke table kereta
router.post("/inputkereta", (req, res) => {
  var nama_kereta = req.body.nama_kereta;
  var kapasitas = req.body.kapasitas;
  var tahun_pembuatan = req.body.tahun_pembuatan;
  var tahun_aktif = req.body.tahun_aktif;

  if (
    nama_kereta.length > 0 &&
    kapasitas.length > 0 &&
    tahun_pembuatan.length > 0 &&
    tahun_aktif.length > 0
  ) {
    const query = `insert into kereta (nama_kereta,kapasitas_kereta,tahun_buat,tahun_aktif) values ('${nama_kereta}','${kapasitas}','${tahun_pembuatan}', '${tahun_aktif}');`; //query tambahkan user baru ke database
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("done");
    });
  } else {
    res.end("empty");
  }
});

//Update data dari table kereta
router.post("/updatekereta", (req, res) => {
  var id_kereta = req.body.id_kereta;
  var nama_kereta = req.body.nama_kereta;
  var kapasitas_kereta = req.body.kapasitas_kereta;
  var tahun_buat = req.body.tahun_buat;
  var tahun_aktif = req.body.tahun_aktif;

  if (nama_kereta && kapasitas_kereta && tahun_buat && tahun_aktif) {
    const query = `update kereta set nama_kereta = '${nama_kereta}', kapasitas_kereta = '${kapasitas_kereta}', tahun_buat = '${tahun_buat}', tahun_aktif = '${tahun_aktif}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (nama_kereta && kapasitas_kereta && tahun_buat) {
    const query = `update kereta set nama_kereta = '${nama_kereta}', kapasitas_kereta = '${kapasitas_kereta}', tahun_buat = '${tahun_buat}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (nama_kereta && kapasitas_kereta && tahun_aktif) {
    const query = `update kereta set nama_kereta = '${nama_kereta}', kapasitas_kereta = '${kapasitas_kereta}', tahun_aktif = '${tahun_aktif}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (kapasitas_kereta && tahun_buat && tahun_aktif) {
    const query = `update kereta set kapasitas_kereta = '${kapasitas_kereta}', tahun_buat = '${tahun_buat}', tahun_aktif = '${tahun_aktif}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (nama_kereta && kapasitas_kereta) {
    const query = `update kereta set nama_kereta = '${nama_kereta}', kapasitas_kereta = '${kapasitas_kereta}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (nama_kereta && tahun_buat) {
    const query = `update kereta set nama_kereta = '${nama_kereta}', tahun_buat = '${tahun_buat}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (nama_kereta && tahun_aktif) {
    const query = `update kereta set nama_kereta = '${nama_kereta}', tahun_aktif = '${tahun_aktif}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (kapasitas_kereta && tahun_buat) {
    const query = `update kereta set kapasitas_kereta = '${kapasitas_kereta}', tahun_buat = '${tahun_buat}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (kapasitas_kereta && tahun_aktif) {
    const query = `update kereta set kapasitas_kereta = '${kapasitas_kereta}', tahun_aktif = '${tahun_aktif}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (tahun_buat && tahun_aktif) {
    const query = `update kereta set tahun_buat = '${tahun_buat}', tahun_aktif = '${tahun_aktif}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (nama_kereta) {
    const query = `update kereta set nama_kereta = '${nama_kereta}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (kapasitas_kereta) {
    const query = `update kereta set kapasitas_kereta = '${kapasitas_kereta}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (tahun_buat) {
    const query = `update kereta set tahun_buat = '${tahun_buat}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (tahun_aktif) {
    const query = `update kereta set tahun_aktif = '${tahun_aktif}' where id_kereta = '${id_kereta}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else {
    res.end("empty");
  }
});

//Delete data dari table kereta
app.post("/deletekereta", (req, res) => {
  const id_kereta = req.body.id_kereta;
  const query = `delete from kereta where id_kereta = '${id_kereta}';`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.end("fail");
    }
    res.end("deleted");
  });
});

//Cek ID kereta
router.post("/cekkereta", (req, res) => {
  var id_kereta = req.body.id_kereta;
  if (id_kereta) {
    const query = `select * from kereta where id_kereta = '${id_kereta}';`; // query ambil data
    db.query(query, (err, results) => {
      if (results.rowCount > 0) {
        res.end("found");
      } else {
        res.end("notfound");
      }
    });
  } else {
    res.end("empty");
  }
});

//Back-end untuk Table Admin
//menampilkan table admin
router.post("/getadmin", (req, res) => {
  const query = "select id_admin,username,super_admin from admin;"; // query ambil data
  //mendapatkan data dari database
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.write(`<table>
    <tr>
      <th scope="col">ID ADMIN</th>
      <th scope="col">USERNAME</th>
      <th scope="col">SUPER ADMIN</th>
    </tr>`);
    for (row of results.rows) {
      res.write(`<tr>
                    <td>${row["id_admin"]}</td>
                    <td>${row["username"]}</td>
                    <td>${row["super_admin"]}</td>
                </tr>`);
    }
    res.end(`</tbody>
    </table>`);
  });
});

//Input data baru ke table admin
router.post("/inputadmin", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if (username.length > 0 && password.length > 0) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (hash) {
        const query = `insert into admin (username, password, super_admin) values ('${username}','${hash}','false');`; //query tambahkan user baru ke database
        db.query(query, (err, results) => {
          if (results) {
            res.end("done");
          } else {
            res.end("fail");
          }
        });
      } else {
        res.end("failhash");
      }
    });
  } else {
    res.end("empty");
  }
});

//Update data dari table admin
router.post("/updateadmin", (req, res) => {
  var id_admin = req.body.id_admin;
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (hash) {
        const query = `update admin set username = '${username}', password = '${hash}' where id_admin = '${id_admin}';`;
        db.query(query, (err, results) => {
          if (err) {
            console.log(err);
            res.end("fail");
          }
          res.end("updated");
        });
      } else {
        res.end("failhash");
      }
    });
  } else if (username) {
    const query = `update admin set username = '${username}' where id_admin = '${id_admin}';`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.end("fail");
      }
      res.end("updated");
    });
  } else if (password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (hash) {
        const query = `update admin set password = '${hash}' where id_admin = '${id_admin}';`;
        db.query(query, (err, results) => {
          if (err) {
            console.log(err);
            res.end("fail");
          }
          res.end("updated");
        });
      } else {
        res.end("failhash");
      }
    });
  } else {
    res.end("empty");
  }
});

//Delete data dari table admin
router.post("/deleteadmin", (req, res) => {
  const id_admin = req.body.id_admin;
  const query = `delete from admin where id_admin = '${id_admin}';`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.end("fail");
    }
    res.end("deleted");
  });
});

//cek admin
router.post("/cekadmin", (req, res) => {
  var id_admin = req.body.id_admin;
  if (id_admin) {
    if (id_admin == 1) {
      res.end("super");
    }
    const query = `select * from admin where id_admin = '${id_admin}';`; // query ambil data
    db.query(query, (err, results) => {
      if (results.rowCount > 0) {
        res.end("found");
      } else {
        res.end("notfound");
      }
    });
  } else {
    res.end("empty");
  }
});

//Back-end untuk melakukan login
router.post("/login", (req, res) => {
  temp = req.session;
  temp.username = req.body.username;
  temp.password = req.body.pass;
  console.log(temp.username);
  console.log(temp.password);
  if (temp.username.length > 0 && temp.password.length > 0) {
    const query = `select password from admin where username like '${temp.username}'`; //query ambil data user untuk login

    //mengecek informasi yang dimasukkan user apakah terdaftar pada database
    db.query(query, (err, results) => {
      if (results.rowCount == 0) {
        res.end("notfound");
      } else {
        bcrypt.compare(
          temp.password,
          results.rows[0].password,
          (err, result) => {
            if (result) {
              res.end("done");
            } else {
              res.end("fail");
            }
          }
        );
      }
    });
  } else {
    res.end("empty");
  }
});

//Back-end untuk melakukan log out
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

//menampilkan usurname
router.post('/getuser' , (req, res) => {
  temp = req.session;
  res.end('<p style="color:white; border-style:solid ;border-color: white;border-radius:25px;width:100px;margin:20px" class="text-center">Hello ' + temp.username + '!</p>');
});

app.use("/", router);
//Port yang digunakan
app.listen(process.env.PORT || 8888, () => {
  console.log(`App Started on PORT ${process.env.PORT || 8888}`);
});