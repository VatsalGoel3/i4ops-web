def test_list_users_empty(client):
    resp = client.get("/api/users/")
    assert resp.status_code == 200
    assert resp.get_json() == []

def test_add_and_list_user(client):
    payload = {
        "username": "alice",
        "email": "alice@example.com",
        "password": "S3cretPwd!",
        "role": "editor",
    }
    resp = client.post("/api/users/", json=payload)
    assert resp.status_code == 201

    resp2 = client.get("/api/users/")
    data = resp2.get_json()
    assert len(data) == 1
    assert data[0]["username"] == "alice"
    assert "password_hash" not in data[0]  # redacted