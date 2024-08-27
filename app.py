from flask import Flask, render_template, request, jsonify
import sqlite3
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def get_db_connection():
    try:
        conn = sqlite3.connect('your_database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        app.logger.error(f"Database connection error: {e}")
        return None

@app.route('/')
def index():
    conn = get_db_connection()
    if conn is None:
        return "Database connection error", 500
    
    try:
        # Fetch days and sort them numerically
        days = conn.execute('SELECT DISTINCT Day FROM ServerInfo').fetchall()
        days = sorted([day['Day'] for day in days], key=lambda x: int(x.split()[1]))
        app.logger.info(f"Fetched days: {days}")
    except sqlite3.Error as e:
        app.logger.error(f"Error fetching days: {e}")
        return "Error fetching data", 500
    finally:
        conn.close()
    
    return render_template('index.html', days=days)

@app.route('/get_servers')
def get_servers():
    selected_day = request.args.get('day')
    app.logger.info(f"Fetching servers for day: {selected_day}")
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection error'}), 500
    
    try:
        query = '''
        SELECT Server_Name, App_Code, Env, Deployment, LOCATION, Patch_Date_MNL, 
               Patch_Start_Time_MNL, Patch_End_Time_MNL, Patch_Start_Time_PST, 
               Patch_End_Time_PST, App_Support_Group_email 
        FROM ServerInfo 
        WHERE Day = ?
        '''
        servers = conn.execute(query, (selected_day,)).fetchall()
        
        servers = [dict(server) for server in servers]
        app.logger.info(f"Fetched {len(servers)} servers for day {selected_day}")
        return jsonify(servers)
    except sqlite3.Error as e:
        app.logger.error(f"Error fetching servers: {e}")
        return jsonify({'error': 'Error fetching server data'}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)