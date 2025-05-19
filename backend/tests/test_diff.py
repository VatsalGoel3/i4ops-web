def test_diff_add_user(client):
    diff_resp = client.post(
        "/api/diff/users",
        json={
            "username": "bob",
            "email": "bob@example.com",
            "password": "Top$ecret1",
            "role": "viewer",
        },
    )
    assert diff_resp.status_code == 200
    body = diff_resp.get_json()
    assert "diff" in body
    assert "+- username: bob" in body["diff"] or "+username: bob" in body["diff"]