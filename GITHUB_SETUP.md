# GitHub連携手順

## 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」ボタンをクリック → 「New repository」を選択
3. リポジトリ名を入力（例: `wedding-plan-platform`）
4. 説明を入力（任意）
5. **Public** または **Private** を選択
6. **「Initialize this repository with a README」のチェックを外す**（既にREADMEがあるため）
7. 「Create repository」をクリック

## 2. リモートリポジトリの追加とプッシュ

GitHubでリポジトリを作成した後、表示されるURLを使用して以下のコマンドを実行：

```bash
# リモートリポジトリを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# またはSSHを使用する場合
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# ブランチ名をmainに変更（GitHubのデフォルトに合わせる）
git branch -M main

# プッシュ
git push -u origin main
```

## 3. 確認

GitHubのリポジトリページを開いて、ファイルが正しくアップロードされているか確認してください。

## 注意事項

- `.env.local` ファイルは `.gitignore` に含まれているため、GitHubにはアップロードされません
- 環境変数は各環境で個別に設定する必要があります
- Supabaseの認証情報は絶対にGitHubにコミットしないでください

