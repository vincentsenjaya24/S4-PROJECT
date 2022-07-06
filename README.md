
## IKN Railway System


This is a website called Railway Management System
Using PostgreSQL, Express, and NodeJS
This will be updated since its all in file javascript and i want to divide the html and javascript file in the future and i want to add css file also
I made it for final project on Lab Data based System at Computer Engineering University of Indonesia 2022

## Overview
Pada website terdapat 2 jenis pengguna yaitu Admin dan User biasa. User biasa(umum) tidak perlu melakukan login untuk mengakses website. Sedangakn admin bisa melakukan login dan melakukan fitur tambahan. Login dan Register menggunakan encryption oleh bycrypt.
Berikut adalah fitur yang bisa diakses oleh user umum:
1. Menu utama yang berisi info mengenai rute kereta
2. Menu stasiun yang berisi info mengenai stasiun yang tersedia
3. Menu kereta yang berisi info mengenai kereta yang tersedia
4. Menu Login untuk melakukan login dan autentikasi

Berikut adalah fitur tambahan yang hanya bisa diakses oleh admin:
1. Menu update/delete rute, stasiun, kereta, tarif, admin dengan parameter ID tiap komponen
2. Penambahan/Penghapusan admin, hanya dapat dilakukan oleh admin yang memiliki titel super admin

User dan Admin bisa berinteraksi dengan data secara bebas dan kapan saja dikerenakan website ini menggunakan sebuah server atau host PostgreSQL yang berbasis Azure, sehingga selama servernya menyala maka tetap bisa mengakses website ini. Namun kekurangan daripada website ini adalah belum dilakukkannya deployment sehingga jika ada orang yang ingin mengaksesnya maka mereka secara local harus memiliki source codenya.


username : rames

password : rames123








## Final Project Group
This project is made by group 8 of Praktikum Sistem Basis Data which consists of:

- Vincent Senjaya
- Ghulam Izzul Fuad
- Nabil Mafaza
- Aryoshi Wicaksono

as final programming assignment in Even Semester 2021/2022 for course Data based System + Lab. (ENCE604016) in Undergraduate of Computer Engineering study program, Department of Electrical Engineering, Faculty of Engineering, Universitas Indonesia.

## Table

1. **Kereta**
> Berisi data mengenai kereta dengan atribut sebagai berikut:

`1. ID_kereta`

`2. nama_kereta`

`3. kapasitas_kereta`

`4. tahun_buat`

`5. tahun_aktif`


2. **Stasiun**
> Berisi data mengenai stasiun dengan atribut sebagai berikut:

`1. ID_stasiun`

`2. nama_stasiun`

`3. daerah_stasiun`

`4. tahun_bangun`


3. **Rute**
> Berisi data mengenai rute dengan atribut sebagai berikut:

`1. ID_rute`

`2. id_kereta`

`3. id_stasiun_berangkat`

`4. waktu_berangkat`

`5. id_stasiun_tiba`

`6. waktu_tiba`

`7. jarak`

4. **Tarif**
> Berisi data mengenai tarif dengan atribut sebagai berikut:

`1. ID_tarif`

`2. id_rute`

`3. harga`


5. **Admin**
> Berisi data mengenai admin dengan atribut sebagai berikut:

`1. ID_admin`

`2. username`

`3. password`

`4. super_admin`


