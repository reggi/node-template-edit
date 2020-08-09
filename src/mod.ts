export class Generate {
  static async cli(process: NodeJS.Process) {
    const message = [
      'This is a starter-kit for node and typescript',
      'this is an example of a cli command running',
      'here I have access to nodes "process" variable',
      `your running this with node version ${process.version}`,
    ];
    console.log(message.join('\n'));
  }
}
