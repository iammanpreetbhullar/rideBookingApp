export class locCategoryService {

    async getLocCategory() {
        const res = await fetch('/data/locationCategory.json');
        const d = await res.json();
        return d.data;
    }
}