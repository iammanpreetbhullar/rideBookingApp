export class LocationService {

    async getLocations() {
        const res = await fetch('/data/locations.json');
        const d = await res.json();
        return d.data;
    }
}