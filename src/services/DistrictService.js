export class DistrictService {

    async getDistricts() {
        const res = await fetch('/data/districts.json');
        const d = await res.json();
        return d.data;
    }
}