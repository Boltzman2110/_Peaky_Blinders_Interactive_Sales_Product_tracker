from flask import Flask, request, render_template
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load the sales data
data = pd.read_csv('sales.csv')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    year = request.form['year']
    game_name = request.form['game_name']
    
    # Filter data based on user input
    filtered_data = data[(data['Year'] == int(year)) & (data['Game'] == game_name)]
    
    if not filtered_data.empty:
        # Return the first matching row (or customize as needed)
        result = filtered_data.iloc[0].to_dict()
        return render_template('index.html', result=result)
    else:
        return render_template('index.html', result=None, error="No matching data found.")

if __name__ == '__main__':
    app.run(debug=True)
