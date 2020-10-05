// model user

export class User {
  constructor(
    public identifiant?: string,
    public siren?: string,
    public name?: string,
    public password?: string,
    public adresse?: string,
    public mail?: string,
    public roles?: string[]
  ) { }

}
