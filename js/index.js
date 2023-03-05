class B {
  constructor(database, domain) {
    this.domain = domain;
    this.database = database;
  }

  c() {
    console.log("c", this.database);
  }
}

class A {
  constructor(database, domain) {
    this.domain = domain;
  }

  b() {
    this.domain.B.c();
  }

  setDomain(domain) {
    this.domain = domain;
  }

  static dependencies = ["B"];
}

const initDomain = (database) => {
  const domain = {
    A: new A(database),
    B: new B(database),
  };

  for (const domainName of Object.keys(domain)) {
    const dependencies = new Set(domain[domainName].dependencies);
    const restrictedDomain = Object.fromEntries(
      Object.entries(domain).filter(([name]) => dependencies.has(name))
    );
    domain[domainName].setDomain(restrictedDomain);
  }

  return;
};

const r = initDomain({ test: 1 });

r.A.b();
