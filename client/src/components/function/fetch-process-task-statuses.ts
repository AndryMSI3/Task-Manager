
interface taskStatuses {
    name: string,
    items: any[],
    statusId: number
}

interface taskStatusMapping {
    requested: taskStatuses,
    toDo: taskStatuses,
    inProgress: taskStatuses,
    done: taskStatuses
}

const taskStatuses: taskStatuses[] = [
    { name: "Requested", items: [], statusId: 0},
    { name: "To Do", items: [], statusId: 0 },
    { name: "In Progress", items: [], statusId: 0 },
    { name: "Done", items: [], statusId: 0 }
];

const fetchCards = async (listId: number): Promise<any[]> => {
    let cardsData: any[] = [];
    try {
        const response = await fetch(
            `http://localhost:8080/cards/card/${listId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
            cardsData = data;
        }
    } catch (error) {
        console.log("Erreur lors de la récupération des cartes :", error);
    }
    return cardsData;
}


async function fetchTaskStatuses({ boardId }:{ boardId: number}) {
    let taskStatusMapping: taskStatusMapping = {
        requested: { name:"", items:[], statusId: 0},
        toDo: { name:"", items:[], statusId: 0},
        inProgress: { name:"", items:[], statusId: 0},
        done: { name:"", items:[], statusId: 0},
    };

    try {
        const response = await fetch(`
            http://localhost:8080/lists/board/${boardId}
        `);
        const listsData = await response.json();
        for (const list of listsData) {
            const status = taskStatuses[list.list_type - 1];
            status.statusId = list.list_id;
            status.items = await fetchCards(list.list_id);
  
            switch (list.list_type) {
                case 1: taskStatusMapping.requested = status; break;
                case 2: taskStatusMapping.toDo = status; break;
                case 3: taskStatusMapping.inProgress = status; break;
                case 4: taskStatusMapping.done = status; break;
                default: break;
            }
        }
        return taskStatusMapping;
    } catch (error) {
        console.log("Erreur lors de la récupération des statuts de tâches :", error);
        throw error;
    }
}

export const fetchTaskStatusesForBoard = async (boardId: number): Promise<taskStatusMapping> => {
    try {
        return await fetchTaskStatuses({boardId});
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
};