describe('xmlschem2typebox()', () => {
    it('should convert the JSON, that has been created from the XMLSchema into a TypeBox type', () => {
        // 1. run the conversion
        const source= './1.xml'
        const typedefTS = './lwm2m-objects.ts'
        await xmlschem2typebox(source, typedefTS)

        const {LwM2MServer} = await import(typedefTS)
        // CustomType is Type.Object(...)

        // Ensure that I can use it to validate a JSON
        const validateJSON(LwM2MServer, {ShortServerID: 10})

        // There should be an exports file with all the types, so that import ... from '@nordicsemiconductor/lwm2m-types' works

        // Write a sample TypesScript file
        await writeFile(sampleTS, `import { LwM2MServer } from '@nordicsemiconductor/lwm2m-types'`, 'utf-8')
        await execSync(`npx tsc ${sampleTS}`)
    })
})