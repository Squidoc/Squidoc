import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const repoRoot = new URL("..", import.meta.url).pathname;
const root = await mkdtemp(join(tmpdir(), "squidoc-smoke-"));
const target = join(root, "Acme Docs!");

try {
  await run("node", [join(repoRoot, "packages/create-squidoc/dist/cli.js"), target], repoRoot);
  await assertGeneratedPackageName(target, "acme-docs");
  await assertGeneratedGitignore(target);
  await linkWorkspacePackages(target);
  await run(
    "node",
    [join(repoRoot, "packages/squidoc/dist/cli.js"), "check"],
    target,
    smokeEnv(target),
  );
  await run(
    "node",
    [join(repoRoot, "packages/squidoc/dist/cli.js"), "build"],
    target,
    smokeEnv(target),
  );
} finally {
  await rm(root, { recursive: true, force: true });
}

async function assertGeneratedPackageName(target, expectedName) {
  const packageJson = JSON.parse(await readFile(join(target, "package.json"), "utf8"));

  if (packageJson.name !== expectedName) {
    throw new Error(
      `Expected generated package name ${expectedName}, received ${packageJson.name}`,
    );
  }
}

async function assertGeneratedGitignore(target) {
  const gitignore = await readFile(join(target, ".gitignore"), "utf8");
  const expectedEntries = ["node_modules/", "dist/", ".squidoc/"];

  for (const entry of expectedEntries) {
    if (!gitignore.includes(entry)) {
      throw new Error(`Generated .gitignore is missing ${entry}`);
    }
  }
}

async function linkWorkspacePackages(target) {
  await mkdir(join(target, "node_modules", "@squidoc"), { recursive: true });
  await symlink(join(repoRoot, "packages/squidoc"), join(target, "node_modules", "squidoc"), "dir");
  await symlink(
    join(repoRoot, "packages/core"),
    join(target, "node_modules", "@squidoc", "core"),
    "dir",
  );
  await symlink(
    join(repoRoot, "packages/theme-basic"),
    join(target, "node_modules", "@squidoc", "theme-basic"),
    "dir",
  );
  await symlink(
    join(repoRoot, "packages/plugin-seo"),
    join(target, "node_modules", "@squidoc", "plugin-seo"),
    "dir",
  );
  await symlink(
    join(repoRoot, "packages/plugin-codeblocks"),
    join(target, "node_modules", "@squidoc", "plugin-codeblocks"),
    "dir",
  );
  await symlink(
    join(repoRoot, "packages/plugin-article-tree"),
    join(target, "node_modules", "@squidoc", "plugin-article-tree"),
    "dir",
  );
}

function smokeEnv(target) {
  return {
    ...process.env,
    XDG_CACHE_HOME: join(target, ".cache"),
  };
}

async function run(command, args, cwd, env = process.env) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
      }
    });
  });
}
