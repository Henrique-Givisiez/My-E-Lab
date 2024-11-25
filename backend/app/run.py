from factory import create_app

app = create_app()

if __name__ == "__main__":
    # Roda a aplicação
    app.run(debug=True)
