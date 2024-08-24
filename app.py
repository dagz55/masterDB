from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('your_database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    
    # Fetch days
    days = conn.execute('SELECT DISTINCT day FROM ServerInfo').fetchall()
    days = [day['day'] for day in days]
    
    # Fetch servers for the selected day
    selected_day = request.args.get('day')
    if selected_day:
        servers = conn.execute('SELECT * FROM ServerInfo WHERE day = ?', (selected_day,)).fetchall()
    else:
        servers = []

    conn.close()
    
    return render_template('index.html', days=days, servers=servers, selected_day=selected_day)

if __name__ == '__main__':
    app.run(debug=True)