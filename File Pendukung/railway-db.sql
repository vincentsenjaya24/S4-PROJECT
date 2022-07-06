--
-- PostgreSQL database dump
--

-- Dumped from database version 13.6
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: railway_database
--

CREATE TABLE public.admin (
    id_admin integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL,
    super_admin boolean NOT NULL
);


ALTER TABLE public.admin OWNER TO railway_database;

--
-- Name: admin_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: railway_database
--

CREATE SEQUENCE public.admin_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_id_admin_seq OWNER TO railway_database;

--
-- Name: admin_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: railway_database
--

ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin.id_admin;


--
-- Name: kereta; Type: TABLE; Schema: public; Owner: railway_database
--

CREATE TABLE public.kereta (
    id_kereta integer NOT NULL,
    nama_kereta character varying(50) NOT NULL,
    kapasitas_kereta smallint NOT NULL,
    tahun_buat date NOT NULL,
    tahun_aktif date NOT NULL
);


ALTER TABLE public.kereta OWNER TO railway_database;

--
-- Name: rute; Type: TABLE; Schema: public; Owner: railway_database
--

CREATE TABLE public.rute (
    id_rute integer NOT NULL,
    id_kereta integer NOT NULL,
    id_stasiun_berangkat integer NOT NULL,
    waktu_berangkat time without time zone NOT NULL,
    id_stasiun_tiba integer NOT NULL,
    waktu_tiba time without time zone NOT NULL,
    jarak integer NOT NULL
);


ALTER TABLE public.rute OWNER TO railway_database;

--
-- Name: stasiun; Type: TABLE; Schema: public; Owner: railway_database
--

CREATE TABLE public.stasiun (
    id_stasiun integer NOT NULL,
    nama_stasiun character varying(50) NOT NULL,
    daerah_stasiun character varying(50) NOT NULL,
    tahun_bangun date NOT NULL
);


ALTER TABLE public.stasiun OWNER TO railway_database;

--
-- Name: tarif; Type: TABLE; Schema: public; Owner: railway_database
--

CREATE TABLE public.tarif (
    id_tarif integer NOT NULL,
    id_rute integer NOT NULL,
    harga integer NOT NULL
);


ALTER TABLE public.tarif OWNER TO railway_database;

--
-- Name: daftar_rute; Type: VIEW; Schema: public; Owner: railway_database
--

CREATE VIEW public.daftar_rute AS
 SELECT rute.id_rute AS no_rute,
    kereta.nama_kereta,
    tarif.harga,
    stas_ber.nama_stasiun AS stasiun_keberangkatan,
    rute.waktu_berangkat,
    stas_tib.nama_stasiun AS stasiun_tiba,
    rute.waktu_tiba
   FROM ((((public.rute
     JOIN public.tarif ON ((rute.id_rute = tarif.id_rute)))
     JOIN public.kereta ON ((rute.id_kereta = kereta.id_kereta)))
     JOIN public.stasiun stas_ber ON ((stas_ber.id_stasiun = rute.id_stasiun_berangkat)))
     JOIN public.stasiun stas_tib ON ((stas_tib.id_stasiun = rute.id_stasiun_tiba)));


ALTER TABLE public.daftar_rute OWNER TO railway_database;

--
-- Name: kereta_id_kereta_seq; Type: SEQUENCE; Schema: public; Owner: railway_database
--

CREATE SEQUENCE public.kereta_id_kereta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kereta_id_kereta_seq OWNER TO railway_database;

--
-- Name: kereta_id_kereta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: railway_database
--

ALTER SEQUENCE public.kereta_id_kereta_seq OWNED BY public.kereta.id_kereta;


--
-- Name: rute_id_rute_seq; Type: SEQUENCE; Schema: public; Owner: railway_database
--

CREATE SEQUENCE public.rute_id_rute_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rute_id_rute_seq OWNER TO railway_database;

--
-- Name: rute_id_rute_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: railway_database
--

ALTER SEQUENCE public.rute_id_rute_seq OWNED BY public.rute.id_rute;


--
-- Name: stasiun_id_stasiun_seq; Type: SEQUENCE; Schema: public; Owner: railway_database
--

CREATE SEQUENCE public.stasiun_id_stasiun_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stasiun_id_stasiun_seq OWNER TO railway_database;

--
-- Name: stasiun_id_stasiun_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: railway_database
--

ALTER SEQUENCE public.stasiun_id_stasiun_seq OWNED BY public.stasiun.id_stasiun;


--
-- Name: tarif_id_tarif_seq; Type: SEQUENCE; Schema: public; Owner: railway_database
--

CREATE SEQUENCE public.tarif_id_tarif_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tarif_id_tarif_seq OWNER TO railway_database;

--
-- Name: tarif_id_tarif_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: railway_database
--

ALTER SEQUENCE public.tarif_id_tarif_seq OWNED BY public.tarif.id_tarif;


--
-- Name: admin id_admin; Type: DEFAULT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.admin ALTER COLUMN id_admin SET DEFAULT nextval('public.admin_id_admin_seq'::regclass);


--
-- Name: kereta id_kereta; Type: DEFAULT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.kereta ALTER COLUMN id_kereta SET DEFAULT nextval('public.kereta_id_kereta_seq'::regclass);


--
-- Name: rute id_rute; Type: DEFAULT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.rute ALTER COLUMN id_rute SET DEFAULT nextval('public.rute_id_rute_seq'::regclass);


--
-- Name: stasiun id_stasiun; Type: DEFAULT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.stasiun ALTER COLUMN id_stasiun SET DEFAULT nextval('public.stasiun_id_stasiun_seq'::regclass);


--
-- Name: tarif id_tarif; Type: DEFAULT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.tarif ALTER COLUMN id_tarif SET DEFAULT nextval('public.tarif_id_tarif_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: railway_database
--

COPY public.admin (id_admin, username, password, super_admin) FROM stdin;
1	admin	$2b$10$ijD0fRCOwktcclQ/Dd7xDeAOJ6VWcP1Grzt2WwloWFECrDq5UEzqK	t
3	admin2	test	t
5	halo1	$2b$10$fnvpKbMjsgSAfbilemPxhustX9fiHTPTu3xrjfHKumZjPpTfjh6Mi	f
7	yoshi	$2b$10$r2mCxvZUkXPdGh5oqVBI4OAT7XrL0xVWa7mTTUFcde4PLu1mHaPn2	f
6	ghulam	$2b$10$Tqy9KIH8rXZ0kjywMP7YK.wPySwjfiGeHd8wecg1TyrlyjryEhZ4K	f
4	halohalo	$2b$10$kkFaJQPRe96O595OwJtL5.phkGWpwGtNcjvhhs5XFpXCCqrE73OJ6	f
\.


--
-- Data for Name: kereta; Type: TABLE DATA; Schema: public; Owner: railway_database
--

COPY public.kereta (id_kereta, nama_kereta, kapasitas_kereta, tahun_buat, tahun_aktif) FROM stdin;
1	Jayalah	200	1990-01-01	2022-02-01
3	Sancaka	150	2001-07-08	2008-04-22
2	Bima	250	2001-08-17	2009-10-10
6	Matarmaja	300	1990-05-14	2003-02-27
\.


--
-- Data for Name: rute; Type: TABLE DATA; Schema: public; Owner: railway_database
--

COPY public.rute (id_rute, id_kereta, id_stasiun_berangkat, waktu_berangkat, id_stasiun_tiba, waktu_tiba, jarak) FROM stdin;
1	1	1	04:00:00	2	13:00:00	20
2	1	2	16:00:00	1	01:00:00	20
4	2	2	07:00:00	3	10:00:00	15
5	3	4	09:15:00	1	11:50:00	13
\.


--
-- Data for Name: stasiun; Type: TABLE DATA; Schema: public; Owner: railway_database
--

COPY public.stasiun (id_stasiun, nama_stasiun, daerah_stasiun, tahun_bangun) FROM stdin;
1	Karangmanis	Nusantara	2001-11-01
2	Lebak Bulus	Jakarta	1991-05-20
3	Stasiun Yogyakarta	Yogyakarta	1981-07-21
4	Balapan	Solo	1983-05-18
\.


--
-- Data for Name: tarif; Type: TABLE DATA; Schema: public; Owner: railway_database
--

COPY public.tarif (id_tarif, id_rute, harga) FROM stdin;
1	1	10000
4	4	20000
5	5	20000
10	2	10000
\.


--
-- Name: admin_id_admin_seq; Type: SEQUENCE SET; Schema: public; Owner: railway_database
--

SELECT pg_catalog.setval('public.admin_id_admin_seq', 11, true);


--
-- Name: kereta_id_kereta_seq; Type: SEQUENCE SET; Schema: public; Owner: railway_database
--

SELECT pg_catalog.setval('public.kereta_id_kereta_seq', 6, true);


--
-- Name: rute_id_rute_seq; Type: SEQUENCE SET; Schema: public; Owner: railway_database
--

SELECT pg_catalog.setval('public.rute_id_rute_seq', 14, true);


--
-- Name: stasiun_id_stasiun_seq; Type: SEQUENCE SET; Schema: public; Owner: railway_database
--

SELECT pg_catalog.setval('public.stasiun_id_stasiun_seq', 5, true);


--
-- Name: tarif_id_tarif_seq; Type: SEQUENCE SET; Schema: public; Owner: railway_database
--

SELECT pg_catalog.setval('public.tarif_id_tarif_seq', 12, true);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id_admin);


--
-- Name: admin admin_username_key; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);


--
-- Name: kereta kereta_nama_kereta_key; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.kereta
    ADD CONSTRAINT kereta_nama_kereta_key UNIQUE (nama_kereta);


--
-- Name: kereta kereta_pkey; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.kereta
    ADD CONSTRAINT kereta_pkey PRIMARY KEY (id_kereta);


--
-- Name: rute rute_pkey; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.rute
    ADD CONSTRAINT rute_pkey PRIMARY KEY (id_rute);


--
-- Name: stasiun stasiun_nama_stasiun_key; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.stasiun
    ADD CONSTRAINT stasiun_nama_stasiun_key UNIQUE (nama_stasiun);


--
-- Name: stasiun stasiun_pkey; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.stasiun
    ADD CONSTRAINT stasiun_pkey PRIMARY KEY (id_stasiun);


--
-- Name: tarif tarif_pkey; Type: CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.tarif
    ADD CONSTRAINT tarif_pkey PRIMARY KEY (id_tarif);


--
-- Name: rute rute_id_kereta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.rute
    ADD CONSTRAINT rute_id_kereta_fkey FOREIGN KEY (id_kereta) REFERENCES public.kereta(id_kereta);


--
-- Name: rute rute_id_stasiun_berangkat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.rute
    ADD CONSTRAINT rute_id_stasiun_berangkat_fkey FOREIGN KEY (id_stasiun_berangkat) REFERENCES public.stasiun(id_stasiun);


--
-- Name: rute rute_id_stasiun_tiba_fkey; Type: FK CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.rute
    ADD CONSTRAINT rute_id_stasiun_tiba_fkey FOREIGN KEY (id_stasiun_tiba) REFERENCES public.stasiun(id_stasiun);


--
-- Name: tarif tarif_id_rute_fkey; Type: FK CONSTRAINT; Schema: public; Owner: railway_database
--

ALTER TABLE ONLY public.tarif
    ADD CONSTRAINT tarif_id_rute_fkey FOREIGN KEY (id_rute) REFERENCES public.rute(id_rute);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: azure_pg_admin
--

REVOKE ALL ON SCHEMA public FROM azuresu;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO azure_pg_admin;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: FUNCTION pg_replication_origin_advance(text, pg_lsn); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_advance(text, pg_lsn) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_create(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_create(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_drop(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_drop(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_oid(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_oid(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_progress(text, boolean); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_progress(text, boolean) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_is_setup(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_is_setup() TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_progress(boolean); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_progress(boolean) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_reset(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_reset() TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_session_setup(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_setup(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_xact_reset(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_reset() TO azure_pg_admin;


--
-- Name: FUNCTION pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone) TO azure_pg_admin;


--
-- Name: FUNCTION pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn) TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset(); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset() TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset_shared(text); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset_shared(text) TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset_single_function_counters(oid); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset_single_function_counters(oid) TO azure_pg_admin;


--
-- Name: FUNCTION pg_stat_reset_single_table_counters(oid); Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT ALL ON FUNCTION pg_catalog.pg_stat_reset_single_table_counters(oid) TO azure_pg_admin;


--
-- Name: COLUMN pg_config.name; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(name) ON TABLE pg_catalog.pg_config TO azure_pg_admin;


--
-- Name: COLUMN pg_config.setting; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(setting) ON TABLE pg_catalog.pg_config TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.line_number; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(line_number) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.type; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(type) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.database; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(database) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.user_name; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(user_name) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.address; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(address) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.netmask; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(netmask) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.auth_method; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(auth_method) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.options; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(options) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_hba_file_rules.error; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(error) ON TABLE pg_catalog.pg_hba_file_rules TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.local_id; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(local_id) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.external_id; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(external_id) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.remote_lsn; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(remote_lsn) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_replication_origin_status.local_lsn; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(local_lsn) ON TABLE pg_catalog.pg_replication_origin_status TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.name; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(name) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.off; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(off) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.size; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(size) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_shmem_allocations.allocated_size; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(allocated_size) ON TABLE pg_catalog.pg_shmem_allocations TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.starelid; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(starelid) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staattnum; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staattnum) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stainherit; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stainherit) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanullfrac; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanullfrac) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stawidth; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stawidth) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stadistinct; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stadistinct) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stakind5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stakind5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.staop5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(staop5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stacoll5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stacoll5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stanumbers5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stanumbers5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues1; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues1) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues2; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues2) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues3; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues3) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues4; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues4) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_statistic.stavalues5; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(stavalues5) ON TABLE pg_catalog.pg_statistic TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.oid; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(oid) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subdbid; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subdbid) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subname; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subname) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subowner; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subowner) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subenabled; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subenabled) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subconninfo; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subconninfo) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subslotname; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subslotname) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subsynccommit; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subsynccommit) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- Name: COLUMN pg_subscription.subpublications; Type: ACL; Schema: pg_catalog; Owner: azuresu
--

GRANT SELECT(subpublications) ON TABLE pg_catalog.pg_subscription TO azure_pg_admin;


--
-- PostgreSQL database dump complete
--

