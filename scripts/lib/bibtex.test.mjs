import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBibtex, bibEntryToPublication } from './bibtex.mjs';

const SAMPLE = `
@inproceedings{carvalho2021handarch,
  title = {HandArch: A deep learning architecture},
  author = {de Carvalho, Gabriel P. and Others, Some},
  booktitle = {Workshop on Computer Vision},
  year = {2021},
  url = {https://example.org/paper}
}

@article{doe2020,
  title = "A Quoted Title",
  author = "Doe, Jane",
  journal = "Journal of Testing",
  year = "2020",
  doi = "10.1000/xyz"
}
`;

test('parseBibtex reads all entries and fields', () => {
  const entries = parseBibtex(SAMPLE);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].type, 'inproceedings');
  assert.equal(entries[0].key, 'carvalho2021handarch');
  assert.equal(entries[0].fields.year, '2021');
  assert.equal(entries[0].fields.booktitle, 'Workshop on Computer Vision');
  assert.equal(entries[1].fields.title, 'A Quoted Title');
});

test('bibEntryToPublication builds a valid publication file with URL', () => {
  const [e] = parseBibtex(SAMPLE);
  const { relPath, contents } = bibEntryToPublication(e);
  assert.equal(relPath, 'src/content/publications/2021-01-01-handarch-a-deep-learning-architecture.md');
  assert.match(contents, /title: "HandArch: A deep learning architecture"/);
  assert.match(contents, /date: 2021-01-01/);
  assert.match(contents, /venue: "Workshop on Computer Vision"/);
  assert.match(contents, /paperurl: "https:\/\/example.org\/paper"/);
  assert.match(contents, /bibtex: \|/); // raw bibtex block preserved
});

test('doi becomes a paperurl when no url present', () => {
  const e = parseBibtex(SAMPLE)[1];
  const { contents } = bibEntryToPublication(e);
  assert.match(contents, /paperurl: "https:\/\/doi.org\/10.1000\/xyz"/);
});

test('entry with no url or doi omits paperurl', () => {
  const [e] = parseBibtex('@misc{x, title={T}, author={A}, year={2019}}');
  const { contents } = bibEntryToPublication(e);
  assert.doesNotMatch(contents, /paperurl/);
});
