// נתונים קבועים
const users = {
    'דוד': { password: '1234', isAdmin: true },
    'אביב': { password: '1234', isAdmin: false },
    'לאה': { password: '1234', isAdmin: false }
};

const cars = ['טויוטה 1', 'טויוטה 2', 'טויוטה 3', 'טויוטה 4', 'טויוטה 5'];

// משתנים גלובליים
let currentUser = null;
let weekOffset = 0;
let reservations = {};

// פונקציית התחברות
function handleLogin(event) {
    event.preventDefault(); // מניעת שליחת הטופס
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        // התחברות מוצלחת
        currentUser = username;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('userDisplay').textContent = `שלום, ${username}`;
        updateSchedule();
    } else {
        alert('שם משתמש או סיסמה שגויים');
    }
}

// פונקציית התנתקות
function handleLogout() {
    currentUser = null;
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// פונקציות ניווט בין שבועות
function prevWeek() {
    weekOffset--;
    updateSchedule();
}

function nextWeek() {
    weekOffset++;
    updateSchedule();
}

// חישוב תאריכי השבוע
function getWeekDates() {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay() + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + i);
        dates.push(date.toLocaleDateString('he-IL'));
    }
    return dates;
}

// שריון רכב
function reserveCar(date, carIndex) {
    const key = `${date}-${carIndex}`;
    
    if (reservations[key] && reservations[key] !== currentUser) {
        if (!users[currentUser].isAdmin) {
            alert('הרכב כבר תפוס');
            return;
        }
    }
    
    reservations[key] = currentUser;
    updateSchedule();
}

// ביטול שריון
function cancelReservation(date, carIndex) {
    const key = `${date}-${carIndex}`;
    
    if (reservations[key] === currentUser || users[currentUser].isAdmin) {
        delete reservations[key];
        updateSchedule();
    } else {
        alert('אין לך הרשאה לבטל שריון זה');
    }
}

// עדכון הטבלה
function updateSchedule() {
    const dates = getWeekDates();
    document.getElementById('currentWeek').textContent = `שבוע ${dates[0]} - ${dates[6]}`;
    
    let tableHTML = '<table><tr><th>רכב</th>';
    dates.forEach(date => {
        tableHTML += `<th>${date}</th>`;
    });
    tableHTML += '</tr>';

    cars.forEach((car, carIndex) => {
        tableHTML += `<tr><td>${car}</td>`;
        dates.forEach(date => {
            const key = `${date}-${carIndex}`;
            const reserved = reservations[key];
            
            if (reserved) {
                tableHTML += `
                    <td class="reserved">
                        ${reserved}
                        <button onclick="cancelReservation('${date}', ${carIndex})">ביטול</button>
                    </td>`;
            } else {
                tableHTML += `
                    <td>
                        <button onclick="reserveCar('${date}', ${carIndex})">שריון</button>
                    </td>`;
            }
        });
        tableHTML += '</tr>';
    });
    
    tableHTML += '</table>';
    document.getElementById('scheduleTable').innerHTML = tableHTML;
}
