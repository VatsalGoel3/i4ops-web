def test_add_project(client):
    resp = client.post("/api/projects/", json={"id": "demo", "pretty_name": "Demo"})
    assert resp.status_code == 201
    lst = client.get("/api/projects/").get_json()
    assert any(p["id"] == "demo" for p in lst)