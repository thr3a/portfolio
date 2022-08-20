export type MyProps = {
  intro_yaml: string,
  sns: Sns[],
};

export interface JsonData {
  sns: Sns[];
  works: Work[];
}

export interface Sns {
  name:  string;
  url:   string;
  icon:  string;
  color: string;
}

export interface Work {
  name: string;
  url:  string;
}
