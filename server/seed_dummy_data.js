const { sequelize, User, Prodi, Matkul, Soal, Berita } = require('./models');
const bcrypt = require('bcryptjs'); // Just in case we need to create users
require('dotenv').config();

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync(); // Ensure tables exist

        // --- 1. Users ---
        // Ensure we have an admin and a student
        const adminEmail = 'admin@istts.ac.id';
        let admin = await User.findOne({ where: { email: adminEmail } });
        if (!admin) {
            const hash = await bcrypt.hash('admin123', 10);
            admin = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hash,
                role: 'admin'
            });
            console.log('Created Admin:', adminEmail);
        }

        const userEmail = 'user@istts.ac.id';
        let student = await User.findOne({ where: { email: userEmail } });
        if (!student) {
            const hash = await bcrypt.hash('user123', 10);
            student = await User.create({
                name: 'Mahasiswa User',
                email: userEmail,
                password: hash,
                role: 'mahasiswa',
                nrp: '123456789'
            });
            console.log('Created Student:', userEmail);
        }

        // --- 2. Prodis ---
        const prodisData = [
            { name: 'Informatika', code: 'INF', fakultas: 'FTI' },
            { name: 'Sistem Informasi', code: 'SI', fakultas: 'FTI' },
            { name: 'Teknik Elektro', code: 'TE', fakultas: 'FTI' },
            { name: 'Teknik Industri', code: 'TI', fakultas: 'FTI' },
            { name: 'Desain Komunikasi Visual', code: 'DKV', fakultas: 'FD' },
            { name: 'Desain Produk', code: 'DP', fakultas: 'FD' }
        ];

        const prodiMap = {};
        for (const p of prodisData) {
            const [prodi] = await Prodi.findOrCreate({ 
                where: { code: p.code }, 
                defaults: p 
            });
            prodiMap[p.code] = prodi;
        }
        console.log('Prodis verified/created.');

        // --- 3. Matkuls ---
        // Comprehensive list covering various semesters (1-8) for filtering checks
        const matkulsData = [
            // Informatika
            { name: 'Pemrograman Dasar', code: 'INF101', semester: 1, prodiCode: 'INF' },
            { name: 'Matematika Diskrit', code: 'INF102', semester: 1, prodiCode: 'INF' },
            { name: 'Algoritma & Struktur Data', code: 'INF201', semester: 2, prodiCode: 'INF' },
            { name: 'Statistika', code: 'INF202', semester: 2, prodiCode: 'INF' },
            { name: 'Basis Data', code: 'INF301', semester: 3, prodiCode: 'INF' },
            { name: 'Pemrograman Web', code: 'INF302', semester: 3, prodiCode: 'INF' },
            { name: 'Jaringan Komputer', code: 'INF303', semester: 3, prodiCode: 'INF' },
            { name: 'Kecerdasan Buatan', code: 'INF401', semester: 4, prodiCode: 'INF' },
            { name: 'Sistem Operasi', code: 'INF402', semester: 4, prodiCode: 'INF' },
            { name: 'Rekayasa Perangkat Lunak', code: 'INF501', semester: 5, prodiCode: 'INF' },
            { name: 'Keamanan Jaringan', code: 'INF502', semester: 5, prodiCode: 'INF' },
            { name: 'Pengolahan Citra Digital', code: 'INF601', semester: 6, prodiCode: 'INF' },
            { name: 'Sistem Terdistribusi', code: 'INF602', semester: 6, prodiCode: 'INF' },
            { name: 'Metode Penelitian', code: 'INF701', semester: 7, prodiCode: 'INF' },
            { name: 'Tugas Akhir 1', code: 'INF702', semester: 7, prodiCode: 'INF' },
            { name: 'Tugas Akhir 2', code: 'INF801', semester: 8, prodiCode: 'INF' },

            // Sistem Informasi
            { name: 'Pengantar Sistem Informasi', code: 'SI101', semester: 1, prodiCode: 'SI' },
            { name: 'Manajemen & Organisasi', code: 'SI102', semester: 1, prodiCode: 'SI' },
            { name: 'Analisis Proses Bisnis', code: 'SI201', semester: 2, prodiCode: 'SI' },
            { name: 'Akuntansi Dasar', code: 'SI202', semester: 2, prodiCode: 'SI' },
            { name: 'Manajemen Basis Data', code: 'SI301', semester: 3, prodiCode: 'SI' },
            { name: 'Desain UX/UI', code: 'SI302', semester: 3, prodiCode: 'SI' },
            { name: 'Analisis & Perancangan SI', code: 'SI401', semester: 4, prodiCode: 'SI' },
            { name: 'E-Business', code: 'SI501', semester: 5, prodiCode: 'SI' },
            { name: 'Enterprise Resource Planning', code: 'SI601', semester: 6, prodiCode: 'SI' },

            // DKV (Sample)
            { name: 'Rupa Dasar 2D', code: 'DKV101', semester: 1, prodiCode: 'DKV' },
            { name: 'Tipografi Dasar', code: 'DKV201', semester: 2, prodiCode: 'DKV' },
            { name: 'Fotografi Dasar', code: 'DKV301', semester: 3, prodiCode: 'DKV' },
            { name: 'Desain Kemasan', code: 'DKV401', semester: 4, prodiCode: 'DKV' },
            
            // Elektro (Sample)
            { name: 'Fisika Dasar', code: 'TE101', semester: 1, prodiCode: 'TE' },
            { name: 'Rangkaian Listrik 1', code: 'TE201', semester: 2, prodiCode: 'TE' },
            { name: 'Elektronika Digital', code: 'TE301', semester: 3, prodiCode: 'TE' },

            // Industri (Sample)
            { name: 'Pengantar Teknik Industri', code: 'TI101', semester: 1, prodiCode: 'TI' },
            { name: 'Statistik Industri', code: 'TI201', semester: 2, prodiCode: 'TI' },
            { name: 'Logistik', code: 'TI301', semester: 3, prodiCode: 'TI' }
        ];

        const matkulMap = {};
        for (const mk of matkulsData) {
            if (!prodiMap[mk.prodiCode]) continue;
            const [matkul] = await Matkul.findOrCreate({
                where: { code: mk.code },
                defaults: {
                    name: mk.name,
                    semester: mk.semester,
                    prodi_id: prodiMap[mk.prodiCode].id
                }
            });
            matkulMap[mk.code] = matkul;
        }
        console.log('Matkuls verified/created.');

        // --- 4. Soals ---
        const types = ['UTS', 'UAS', 'Kuis', 'Lainnya'];
        const years = [2020, 2021, 2022, 2023, 2024];

        let createdCount = 0;
        // Create random soals for each matkul
        for (const mkCode in matkulMap) {
            const matkul = matkulMap[mkCode];
            
            // For each year
            for (const year of years) {
                // Randomize which types exist for this year/matkul
                for (const type of types) {
                    // 60% chance to exist
                    if (Math.random() > 0.4) {
                        try {
                            const title = `${type} ${matkul.name} ${year}`;
                            
                            // Check for duplicates to prevent spamming if script re-runs
                            // Simplistic check by title & matkul_id
                            const existing = await Soal.findOne({ 
                                where: { 
                                    title: title, 
                                    matkul_id: matkul.id,
                                    type: type,
                                    year: year
                                } 
                            });

                            if (!existing) {
                                await Soal.create({
                                    title: title,
                                    type: type,
                                    year: year,
                                    file_url: 'https://example.com/dummy_file.pdf', // Dummy link
                                    drive_file_id: `dummy_${matkul.code}_${year}_${type}_${Date.now()}`,
                                    download_count: Math.floor(Math.random() * 100),
                                    upvote_count: Math.floor(Math.random() * 50),
                                    status: 'Aktif',
                                    matkul_id: matkul.id,
                                    uploader_id: admin.id
                                });
                                createdCount++;
                            }
                        } catch (e) {
                            console.error(`Error creating soal for ${matkul.code}:`, e.message);
                        }
                    }
                }
            }
        }
        console.log(`Finished! Created ${createdCount} new Soals.`);


        // --- 5. Berita (News) ---
        const beritaData = [
            {
                title: 'Jadwal UTS Semester Genap 2024/2025',
                desc: 'Berikut adalah jadwal UTS untuk semester genap tahun ajaran 2024/2025. Harap diperhatikan dengan seksama.',
                type: 'Pengumuman',
                startDate: new Date('2024-03-01'),
                endDate: new Date('2024-03-15'),
                status: 'Aktif',
                views: 150
            },
            {
                title: 'Panduan Penggunaan Repository Soal',
                desc: 'Dokumen ini berisi panduan lengkap cara mencari dan mengunduh soal ujian dari repository ini.',
                type: 'Panduan',
                startDate: new Date('2023-08-01'),
                endDate: new Date('2025-08-01'), // Long running
                status: 'Aktif',
                views: 320
            },
            {
                title: 'Libur Hari Raya Idul Fitri',
                desc: 'Kampus akan diliburkan mulai tanggal ... sampai ... dalam rangka Hari Raya Idul Fitri.',
                type: 'Informasi',
                startDate: new Date('2024-04-05'),
                endDate: new Date('2024-04-12'),
                status: 'Aktif',
                views: 85
            },
            {
                title: 'Maintenance Server',
                desc: 'Akan dilakukan maintenance server pada hari Sabtu pukul 22:00. Mohon maaf atas ketidaknyamanannya.',
                type: 'Informasi',
                startDate: new Date('2023-12-01'),
                endDate: new Date('2023-12-02'),
                status: 'Nonaktif', // Already passed
                views: 45
            },
            {
                title: 'Workshop Penulisan Karya Ilmiah',
                desc: 'Ikuti workshop penulisan karya ilmiah yang akan diadakan di Auditorium.',
                type: 'Pengumuman',
                startDate: new Date('2024-05-20'),
                endDate: new Date('2024-05-25'),
                status: 'Aktif',
                views: 12
            }
        ];


        for (const b of beritaData) {
            const [berita, created] = await Berita.findOrCreate({
                where: { title: b.title },
                defaults: b
            });
            if (created) console.log('Created Berita:', b.title);
        }
        console.log('Berita verified/created.');

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await sequelize.close();
        process.exit();
    }
};

seed();
