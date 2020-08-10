import {Template} from './template';
import * as fs from 'fs';
import * as path from 'path';
import {expect} from 'chai';
import * as sinon from 'sinon';

interface SpecTest {
  dir: string;
  action: string;
  result?: string[];
  error?: boolean;
}
type Spec = SpecTest[];

const spec: Spec = [
  {
    dir: 'template-commit',
    action: 'commit',
    result: [
      '.template/alpha.txt',
      '.template/beta.txt',
      '.template/gamma.txt',
      '.template/delta.txt',
      '.template/template.json',
      'alpha.txt',
      'beta.txt',
      'delta.txt',
      'gamma.txt',
      'template.json',
    ],
  },
  {
    dir: 'template-gitignore',
    action: 'commit',
    result: [
      '.template/.gitignore',
      '.template/alpha.txt',
      '.template/beta.txt',
      '.template/gamma.txt',
      '.template/template.json',
      '.gitignore',
      'beta.txt',
      'gamma.txt',
      'template.json',
    ],
  },
  {
    dir: 'template-no-ignore',
    action: 'commit',
    result: [
      '.template/alpha.txt',
      '.template/beta.txt',
      '.template/gamma.txt',
      '.template/template.json',
      'alpha.txt',
      'beta.txt',
      'gamma.txt',
      'template.json',
    ],
  },
  {
    dir: 'template-recursive',
    action: 'commit',
    result: [
      '.github/a.txt',
      'alpha.txt',
      'beta.txt',
      'gamma.txt',
      'template.json',
      '.template/alpha.txt',
      '.template/beta.txt',
      '.template/gamma.txt',
      '.template/template.json',
      '.template/.github/a.txt',
    ],
  },
  {
    dir: 'template-pull',
    action: 'pull',
    result: [
      'alpha.txt',
      'beta.txt',
      'gamma.txt',
      'template.json',
      '.template/alpha.txt',
      '.template/beta.txt',
      '.template/gamma.txt',
      '.template/template.json',
    ],
  },
  {
    dir: 'template-package',
    action: 'commit',
    result: [
      '.template/package.json',
      '.template/alpha.txt',
      '.template/beta.txt',
      '.template/template.json',
      'alpha.txt',
      'beta.txt',
      'gamma.txt',
      'package.json',
      'template.json',
    ],
  },
  {
    dir: 'template-pull-json',
    action: 'pull',
    result: [
      '.template/package.json',
      '.template/alpha.txt',
      '.template/beta.txt',
      '.template/template.json',
      'alpha.txt',
      'beta.txt',
      'gamma.txt',
      'package.json',
      'template.json',
    ],
  },
  {
    dir: 'template-missing-config',
    action: 'commit',
    error: true,
  },
  {
    dir: 'template-missing-src',
    action: 'commit',
    error: true,
  },
  {
    dir: 'template-commit',
    action: 'unknown',
    error: true,
  },
];

describe('Template', () => {
  context('.cli()', () => {
    after(async () => {
      await Template.execAsync('git checkout main -- ./examples/ ');
    });

    spec.forEach(spec => {
      it(`should use "${spec.dir}"`, async () => {
        const cwd = path.join(__dirname, `../examples/${spec.dir}`);
        const process = {
          argv: ['skip', 'skip', spec.action],
          cwd: () => cwd,
          stderr: {
            write: sinon.stub(),
          },
          exit: sinon.stub(),
        };
        await Template.cli((process as unknown) as NodeJS.Process);
        if (spec.error) {
          expect(process.exit.args).to.deep.equal([[1]]);
        }
        if (spec.result) {
          spec.result.forEach(item => {
            const full = path.join(cwd, item);
            expect(fs.statSync(full).isFile()).to.equal(true);
          });
        }
      });
    });
  });

  context('.deepMerge()', () => {
    it('should merge', () => {
      const result = Template.deepMerge({hello: true}, {world: true});
      expect(result).to.deep.equal({hello: true, world: true});
    });
    it('should deep merge', () => {
      const result = Template.deepMerge(
        {
          hello: true,
          main: {
            name: 'thomas',
          },
        },
        {
          world: true,
          main: {
            age: 30,
          },
        }
      );
      expect(result).to.deep.equal({
        hello: true,
        world: true,
        main: {
          name: 'thomas',
          age: 30,
        },
      });
    });
  });
});
