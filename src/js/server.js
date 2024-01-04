const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const tickets = [];

tickets.push({
    id: 1,
    name: 'Поменять картридж в принтере',
    status: false,
    created: Date.now(),
    description: 'Полное описание тикета - поменять карридж в принтере на втором этаже Полное описание тикета - поменять карридж в принтере на втором этаже Полное описание тикета - поменять карридж в принтере на втором этаже',
});
tickets.push({
    id: 2,
    name: 'Полить цветы',
    status: true,
    created: Date.now(),
    description: 'Полить цветы в пятницу на даче Полить цветы в пятницу на даче Полить цветы в пятницу на даче Полить цветы в пятницу на даче',
});

app.use(cors());
app.use(bodyParser());

router.get('/', async (ctx) => {
    const { method, id } = ctx.request.query;

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets.map(({ id, name, status, created, description }) => ({ id, name, status, created, description }));
            break;
        case 'ticketById':
            const ticket = tickets.find((t) => t.id == id);
            if (ticket) {
                ctx.response.body = ticket;
            } else {
                ctx.response.status = 404;
            }
            break;
        default:
            ctx.response.status = 404;
            break;
    }
});

router.post('/', async (ctx) => {
    const { method } = ctx.request.query;
    const { name, description, status } = ctx.request.body;

    switch (method) {
        case 'createTicket':
            const newTicket = {
                id: tickets.length + 1,
                name,
                description,
                status,
                created: Date.now(),
            };
            tickets.push(newTicket);
            ctx.response.body = newTicket;
            break;
        default:
            ctx.response.status = 404;
            break;
    }
});

router.delete('/', async (ctx) => {
    const { method, id } = ctx.request.query;

    switch (method) {
        case 'deleteTicket':
            const indexToDelete = tickets.findIndex((t) => t.id == id);
            if (indexToDelete !== -1) {
                const deletedTicket = tickets.splice(indexToDelete, 1);
                ctx.response.body = deletedTicket[0];
            } else {
                ctx.response.status = 404;
            }
            break;
        default:
            ctx.response.status = 404;
            break;
    }
});

router.put('/', async (ctx) => {
    const { method, id } = ctx.request.query;
    const { name, description, status } = ctx.request.body;

    switch (method) {
        case 'updateTicket':
            const indexToUpdate = tickets.findIndex((t) => t.id == id);
            if (indexToUpdate !== -1) {
                tickets[indexToUpdate] = {
                    ...tickets[indexToUpdate],
                    name: name || tickets[indexToUpdate].name,
                    description: description || tickets[indexToUpdate].description,
                    status: status !== undefined ? status : tickets[indexToUpdate].status,
                };
                ctx.response.body = tickets[indexToUpdate];
            } else {
                ctx.response.status = 404;
            }
            break;
        default:
            ctx.response.status = 404;
            break;
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8888, () => {
    console.log(`Server is running on port 8888`);
});
