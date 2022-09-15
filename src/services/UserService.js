export class UserService {

    async getUsers() {
        const res = await fetch('/data/users.json');
        const d = await res.json();
        return d.data;
    }
}