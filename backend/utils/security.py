import crypt, secrets, string
def hash_password(plain: str) -> str:
    salt = "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
    return crypt.crypt(plain, f"$6${salt}$") # SHA-512