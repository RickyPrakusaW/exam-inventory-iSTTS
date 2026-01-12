
const fs = require('node:fs');

const BASE_URL = 'http://localhost:5000/api';
const RUN_ID = Math.floor(Math.random() * 10000); // Random suffix to avoid collisions

async function runTests() {
    try {
        console.log(`--- Starting CRUD Verification (Run ID: ${RUN_ID}) ---`);

        // 1. PRODI CRUD
        console.log('\n[PRODI] Testing Create...');
        const prodiRes = await fetch(`${BASE_URL}/master/prodi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Teknik Test ${RUN_ID}`,
                code: `TT-${RUN_ID}`,
                fakultas: 'Fakultas Test'
            })
        });
        if (!prodiRes.ok) throw new Error(`Prodi Create Failed: ${prodiRes.status} ${await prodiRes.text()}`);
        const prodiData = await prodiRes.json();
        const prodiId = prodiData.id;
        console.log('Created Prodi ID:', prodiId);

        console.log('[PRODI] Testing Update...');
        const prodiUpdateRes = await fetch(`${BASE_URL}/master/prodi/${prodiId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Teknik Test Updated ${RUN_ID}`,
                code: `TT-UPD-${RUN_ID}`,
                fakultas: 'Fakultas Test'
            })
        });
        if (!prodiUpdateRes.ok) throw new Error(`Prodi Update Failed: ${prodiUpdateRes.status} ${await prodiUpdateRes.text()}`);
        console.log('Prodi Updated');

        // 2. MATKUL CRUD
        console.log('\n[MATKUL] Testing Create...');
        const matkulRes = await fetch(`${BASE_URL}/master/matkul`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Matkul Test ${RUN_ID}`,
                code: `MTK-${RUN_ID}`,
                semester: 1,
                prodi_id: prodiId
            })
        });
        if (!matkulRes.ok) throw new Error(`Matkul Create Failed: ${matkulRes.status} ${await matkulRes.text()}`);
        const matkulData = await matkulRes.json();
        const matkulId = matkulData.id;
        console.log('Created Matkul ID:', matkulId);

        console.log('[MATKUL] Testing Update...');
        const matkulUpdateRes = await fetch(`${BASE_URL}/master/matkul/${matkulId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Matkul Test Updated ${RUN_ID}`,
                code: `MTK-U-${RUN_ID}`,
                semester: 2,
                prodi_id: prodiId
            })
        });
        if (!matkulUpdateRes.ok) throw new Error(`Matkul Update Failed: ${matkulUpdateRes.status} ${await matkulUpdateRes.text()}`);
        console.log('Matkul Updated');

        // 3. SOAL CRUD
        console.log('\n[SOAL] Testing Create (Multipart)...');
        // Create a dummy PDF file with valid PDF header
        const pdfContent = '%PDF-1.4\n%\nDummy PDF Content';
        const buffer = Buffer.from(pdfContent);
        
        try {
            const form = new FormData();
            form.append('title', `Soal Test ${RUN_ID}`);
            form.append('type', 'UTS');
            form.append('year', '2024');
            form.append('matkul_id', matkulId.toString());
            form.append('uploader_id', '1');
            form.append('status', 'Aktif');
            
            // Create Blob with specific type
            const fileBlob = new Blob([buffer], { type: 'application/pdf' });
            form.append('file', fileBlob, 'test_soal.pdf');

            const soalRes = await fetch(`${BASE_URL}/soal`, {
                method: 'POST',
                body: form
            });
            
            if (!soalRes.ok) throw new Error(`Soal Create Failed: ${soalRes.status} ${await soalRes.text()}`);
            const soalData = await soalRes.json();
            const soalId = soalData.data.id;
            console.log('Created Soal ID:', soalId);

            console.log('[SOAL] Testing Update (Metadata)...');
            const soalUpdateRes = await fetch(`${BASE_URL}/soal/${soalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Soal Test Updated ${RUN_ID}`,
                    type: 'UAS',
                    year: 2025,
                    matkul_id: matkulId,
                    status: 'Nonaktif'
                })
            });
            if (!soalUpdateRes.ok) throw new Error(`Soal Update Failed: ${soalUpdateRes.status} ${await soalUpdateRes.text()}`);
            console.log('Soal Updated');

            // CLEANUP
            console.log('\n[CLEANUP] Deleting Soal...');
            const delSoal = await fetch(`${BASE_URL}/soal/${soalId}`, { method: 'DELETE' });
            if (!delSoal.ok) console.error('Failed to delete soal');
            console.log('Soal Deleted');

        } catch (e) {
            throw e;
        }

        console.log('[CLEANUP] Deleting Matkul...');
        await fetch(`${BASE_URL}/master/matkul/${matkulId}`, { method: 'DELETE' });
        console.log('Matkul Deleted');

        console.log('[CLEANUP] Deleting Prodi...');
        await fetch(`${BASE_URL}/master/prodi/${prodiId}`, { method: 'DELETE' });
        console.log('Prodi Deleted');

        console.log('\n--- VERIFICATION SUCCESSFUL ---');

    } catch (error) {
        console.error('\n--- VERIFICATION FAILED ---');
        console.error(error);
    }
}

runTests();
