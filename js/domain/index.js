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
}

const initDomain = (database) => {
  const domain = {};
  domain.A = new A(database, domain);
  domain.B = new B(database, domain);
  return domain;
};

const r = initDomain({ test: 1 });

r.A.b();
