# Contributing

## Publishing Packages

Create a changeset, when a change should result in a version bump:

```
npm run changeset
```

From the main branch, consolidate changesets, bumping the versions of affected packages:

```
npm run version
```

Then publish to the NPM registry:

```
npm run release
```
