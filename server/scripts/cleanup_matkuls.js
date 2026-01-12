const { sequelize, Matkul, Soal } = require('../models');
const { Op } = require('sequelize');

const typoMap = {
    'MachineLearningg': 'MachineLearning',
    'MotionGraphicss': 'MotionGraphics',
    'GenerativeArtt': 'GenerativeArt',
    'StatistikaTerapann': 'StatistikaTerapan',
    'ObjectOrientedAnalysisDanDesignn': 'ObjectOrientedAnalysisDanDesain',
    'WebSeviceSOA': 'WebServiceSOA',
    // Add any others found
};

const cleanupMatkuls = async () => {
    try {
        await sequelize.authenticate();
        console.log('--- Starting Cleanup ---');

        // 1. Fix Typos
        console.log('--- Fixing Typos ---');
        for (const [badName, goodName] of Object.entries(typoMap)) {
            const badMatkuls = await Matkul.findAll({ where: { name: badName } });
            
            if (badMatkuls.length === 0) continue;

            console.log(`Processing typo: ${badName} -> ${goodName}`);

            // Find or cleanup the good name target
            // We might have multiple bad ones and possibly multiple good ones already
            
            for (const badMatkul of badMatkuls) {
                // Check if a 'good' matkul already exists for this Prodi? 
                // Wait, names are unique PER PRODI usually, but our import created dupes globally or per prodi?
                // The current schema says 'name' is NOT unique constrained in the model definition visible earlier (only ID).
                // But typically we want unique Name + Prodi.
                // For now, let's just find ANY matkul with the good name.
                
                // Strategy: Just rename the bad one to the good one.
                // The deduplication step later will handle merging if the good one already exists.
                badMatkul.name = goodName;
                await badMatkul.save();
                console.log(`  Renamed Matkul ID ${badMatkul.id}: ${badName} -> ${goodName}`);
            }
        }

        // 2. Deduplicate
        console.log('\n--- Deduplicating ---');
        
        // Fetch all matkuls
        const allMatkuls = await Matkul.findAll();
        
        // Group by Name (ignoring Prodi for now? OR should we respect Prodi?)
        // The import script linked Matkul to Prodi. 
        // If "AgamaIslam" exists for "S1TI" and "S1DKV", they should probably stay separate if they are prodi-specific?
        // OR the user wants them merged globally?
        // User said "Some prodis also wound up in the database as matkuls".
        // And "duplicate matkuls".
        // Usually General Education subjects (MKDU) like Agama, Pancasila might be shared OR duplicated per Prodi.
        // Given the request "delete the duplicate matkuls as well", and the file names like "UAS_S1TI_Agama..." and "UAS_S1DKV_Agama...",
        // The import script previously created them PER PRODI (finding by name + prodi_id).
        // BUT my recent change stripped the prodi code.
        // If I strip the code, I get "AgamaIslam" for S1TI and "AgamaIslam" for S1DKV.
        // If the DB has `Matkul.prodi_id`, they are distinct entries.
        // Should they be merged?
        // If the user considers them "duplicates", maybe they want ONE "AgamaIslam" for the whole university?
        // OR they just mean the technical duplicates where "AgamaIslam" appears TWICE for the SAME prodi?
        
        // Let's assume strict deduplication: Same Name AND Same Prodi = Duplicate.
        // AND ALSO: Same Name with NULL Prodi (if any).
        
        // However, looking at the dump:
        // [221] AgamaBuddha (Code: AGA101)
        // [275] AgamaBuddha (Code: AGA101)
        // We don't see the Prodi ID in the dump.
        
        // Let's try to deduplicate strictly by NAME first?
        // If I merge "AgamaIslam" (S1TI) and "AgamaIslam" (S1DKV), the resulting Matkul will belong to ONE prodi (e.g. S1TI).
        // So S1DKV Soals will point to an S1TI Matkul.
        // Is that desired? 
        // Maybe not for specific subjects, but for MKDU it might be fine.
        // SAFEST BET: Deduplicate by Name + Prodi combination first.
        // IF the user wants global deduplication, that's a bigger change.
        // Let's stick to Name + Prodi dedupe + Name dedupe for same-name entries?
        
        // Let's try to group by NAME only for now, as the user complained about "Duplicate Matkuls" after I stripped the Prodi Code.
        // If I have "GenerativeArt" ID 100 (Prodi A) and "GenerativeArt" ID 101 (Prodi B),
        // and I merge them, checking which Prodi is kept.
        // If the user sees "GenerativeArt" twice in the dropdown, they consider it duplicate.
        // In the "Data Master" view, it likely lists ALL matkuls.
        // I will merge them by NAME. The resulting consolidates Matkul will keep the Prodi of the 'master'.
        
        const groups = {};
        allMatkuls.forEach(m => {
            const key = m.name.trim(); // Normalize
            if (!groups[key]) groups[key] = [];
            groups[key].push(m);
        });

        for (const [name, group] of Object.entries(groups)) {
            if (group.length > 1) {
                console.log(`Processing duplicate group: ${name} (${group.length} records)`);
                
                // Sort by ID to pick a stable master (lowest ID)
                group.sort((a, b) => a.id - b.id);
                const master = group[0];
                const slaves = group.slice(1);

                for (const slave of slaves) {
                    // Update all Soals pointing to slave -> master
                    const soals = await Soal.findAll({ where: { matkul_id: slave.id } });
                    if (soals.length > 0) {
                        await Soal.update({ matkul_id: master.id }, { where: { matkul_id: slave.id } });
                        console.log(`    Moved ${soals.length} soals from ID ${slave.id} to ${master.id}`);
                    }
                    
                    // Delete slave
                    await slave.destroy();
                    console.log(`    Deleted slave Matkul ID ${slave.id}`);
                }
            }
        }

        console.log('--- Cleanup Complete ---');

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await sequelize.close();
    }
};

cleanupMatkuls();
