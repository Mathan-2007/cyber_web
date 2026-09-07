import os
import time
import pymysql

DB_HOST = os.environ.get('DB_HOST', 'mysql-1ab70c0e-cybersecurity.l.aivencloud.com')
DB_PORT = int(os.environ.get('DB_PORT', 20453))
DB_USER = os.environ.get('DB_USER', 'avnadmin')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'AVNS_2sID-rzSYyk0ci8mNwc')
DB_NAME = os.environ.get('DB_NAME', 'defaultdb')
DB_SSL = os.environ.get('DB_SSL', 'required').lower()
INIT_SQL_PATH = os.environ.get('INIT_SQL_PATH', os.path.join(os.path.dirname(__file__), '..', 'init_db.sql'))

def connect_with_retries(retries=3, timeout=10, delay=5):
    for attempt in range(1, retries + 1):
        try:
            ssl_arg = None
            if DB_SSL in ('required', 'true', '1', 'yes'):
                # pymysql requires ssl dict; empty dict requests SSL negotiation
                ssl_arg = {'ssl': {}}

            conn = pymysql.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                db=DB_NAME,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor,
                connect_timeout=timeout,
                read_timeout=timeout,
                write_timeout=timeout,
                ssl=ssl_arg
            )
            return conn
        except Exception as e:
            print(f"DB connect attempt {attempt} failed: {e}")
            if attempt < retries:
                time.sleep(delay)
    raise ConnectionError(f"Unable to connect to DB after {retries} attempts")


def execute_sql_file(connection, sql_path):
    if not os.path.exists(sql_path):
        raise FileNotFoundError(f"SQL file not found: {sql_path}")

    with open(sql_path, 'r', encoding='utf8') as fh:
        content = fh.read()

    # Naive split on ';' — acceptable for typical dumps; skip empty statements
    statements = [s.strip() for s in content.split(';') if s.strip()]

    with connection.cursor() as cursor:
        for i, stmt in enumerate(statements, 1):
            try:
                cursor.execute(stmt)
                # Commit after each statement to avoid large transaction issues
                connection.commit()
            except Exception as e:
                # Log and continue — some statements like /*!40101 ... */ may fail
                print(f"Statement {i} failed: {e}\n--- SQL ---\n{stmt[:200]}...\n")


if __name__ == '__main__':
    try:
        conn = connect_with_retries(retries=3, timeout=10, delay=5)
        print('Connected to DB')
        try:
            # If an init SQL exists, run it
            if os.path.exists(INIT_SQL_PATH):
                print(f'Executing SQL file: {INIT_SQL_PATH}')
                execute_sql_file(conn, INIT_SQL_PATH)
                print('SQL execution completed')
            else:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT VERSION() AS version')
                    print(cursor.fetchall())
        finally:
            conn.close()
    except Exception as exc:
        print('ERROR:', exc)
