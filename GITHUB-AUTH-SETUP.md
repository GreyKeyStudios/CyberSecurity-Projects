# GitHub Authentication Setup Guide

GitHub no longer accepts username/password. You need to use either **SSH keys** or a **Personal Access Token (PAT)**.

## Option 1: SSH Keys (Recommended - Best for Long-Term)

### Step 1: Check if you already have SSH keys

In your WSL/Ubuntu terminal:
```bash
ls -la ~/.ssh/id_*.pub
```

If you see files like `id_rsa.pub` or `id_ed25519.pub`, you already have keys! Skip to Step 3.

### Step 2: Generate a new SSH key

```bash
# Generate a new SSH key (use your GitHub email)
ssh-keygen -t ed25519 -C "michaelwalton1984@gmail.com"

# When prompted:
# - Press Enter to accept default file location (~/.ssh/id_ed25519)
# - Enter a passphrase (optional but recommended) or press Enter for no passphrase
```

### Step 3: Start the SSH agent and add your key

```bash
# Start the SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key
ssh-add ~/.ssh/id_ed25519
```

### Step 4: Copy your public key

```bash
# Display your public key (copy the entire output)
cat ~/.ssh/id_ed25519.pub
```

### Step 5: Add the key to GitHub

1. Go to GitHub.com → Settings → SSH and GPG keys
   - Or direct link: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title:** "WSL Ubuntu" (or any name you like)
4. **Key:** Paste the entire public key you copied
5. Click **"Add SSH key"**

### Step 6: Test the connection

```bash
ssh -T git@github.com
```

You should see: `Hi GreyKeyStudios! You've successfully authenticated...`

### Step 7: Update your git remote to use SSH

```bash
cd /home/titan/projects/CyberSecurity-Projects

# Check current remote
git remote -v

# If it shows HTTPS, change to SSH:
git remote set-url origin git@github.com:GreyKeyStudios/CyberSecurity-Projects.git

# Verify
git remote -v
```

### Step 8: Push!

```bash
git add .
git commit -m "Initial portfolio website setup"
git push -u origin main
# or if your branch is called 'master':
git push -u origin master
```

---

## Option 2: Personal Access Token (PAT) - Quick Alternative

If you prefer not to use SSH, you can use a Personal Access Token.

### Step 1: Create a Personal Access Token

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Direct link: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Note:** "Portfolio Website Push"
4. **Expiration:** Choose 90 days or No expiration
5. **Select scopes:** Check `repo` (full control of private repositories)
6. Click **"Generate token"**
7. **IMPORTANT:** Copy the token immediately (you won't see it again!)

### Step 2: Use the token when pushing

When you push, use the token as your password:

```bash
cd /home/titan/projects/CyberSecurity-Projects

git add .
git commit -m "Initial portfolio website setup"

# When prompted for password, paste your token (not your GitHub password)
git push -u origin main
```

**Username:** Your GitHub username (GreyKeyStudios)  
**Password:** Paste your Personal Access Token

### Step 3: (Optional) Save credentials

To avoid entering the token every time:

```bash
# Configure git credential helper
git config --global credential.helper store

# Next time you push, it will save your credentials
```

---

## Troubleshooting

### SSH: "Permission denied (publickey)"

- Make sure you added the **public** key (`.pub` file) to GitHub, not the private key
- Verify: `ssh-add -l` should show your key
- Test: `ssh -T git@github.com`

### HTTPS: "Authentication failed"

- Make sure you're using the **token** as password, not your GitHub password
- Check that the token has `repo` scope
- Try generating a new token

### "Repository not found"

- Make sure the repository exists on GitHub
- Check the remote URL: `git remote -v`
- Verify you have push access to the repo

### Still having issues?

1. Check your git config:
   ```bash
   git config --global user.name
   git config --global user.email
   ```

2. If not set:
   ```bash
   git config --global user.name "Michael Walton"
   git config --global user.email "michaelwalton1984@gmail.com"
   ```

---

## Recommendation

**Use SSH keys** - They're more secure and you won't need to enter credentials every time. Once set up, pushing is just `git push` with no prompts.
