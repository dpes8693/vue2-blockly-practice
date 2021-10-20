// 變數 文件: https://developers.google.com/blockly/guides/create-custom-blocks/variables
// 變數 源碼: https://github.com/google/blockly/blob/31ee4ead4ae9d0da00d54ba5aa636d2bad59ec18/blocks/variables.js

// 多國: https://docs.google.com/spreadsheets/d/1_-O1x4TD500Qc0EV7Vu1PAAZcTLoc2mYJ79gjHMM8JI/edit#gid=1200843294
// 技術規格 https://hackmd.io/@MsTiynbcRqedDVqFoOfSYg/ryi9dkDm_

import Blockly from "blockly";

const generator = new Blockly.Generator("Ruby");
generator.PRECEDENCE = 0;

const timers = [
  ["Timer1",   "usr_t000"],
  ["Timer2",   "usr_t001"],
  ["Timer3",   "usr_t002"],
  ["Timer4",   "usr_t003"],
  ["Timer5",   "usr_t004"],
];
const counters = [
  ["Counter1",   "usr_t000"],
  ["Counter2",   "usr_t001"],
  ["Counter3",   "usr_t002"],
  ["Counter4",   "usr_t003"],
  ["Counter5",   "usr_t004"],
];
const globals = [
  ["Global1",   "usr_t000"],
  ["Global2",   "usr_t001"],
  ["Global3",   "usr_t002"],
  ["Global4",   "usr_t003"],
  ["Global5",   "usr_t004"],
];
const Constants = {
  vibrationSensors: [
    ["震動1", "05edi007"],
    ["震動2", "05edi008"],
  ],
  sensors: [
    ["溫度", "05edi005"],
    ["濕度", "05edi006"],
  ],
  timersSet: timers,
  timersGet: timers,
  countersSet: counters,
  countersGet: counters,
  globalsSet: globals,
  globalsGet: globals,
  status: [],
  statusValue: [
    [
      ["1", "1"],
      ["2", "2"],
    ],
    [["1", "1"]],
    [["1", "1"]],
    [["1", "1"]],
    [["1", "1"]],
  ],
  statusGroup: [
    ["bit35", "35"],
    ["bit36", "36"],
    ["溫度壯態", "37"],
  ],
  statusGroupLength: [
    2, 2, 3
  ],
  statusGroupValue: [
    [
      ["a1", "00"],
      ["b1", "01"],
      ["c1", "10"],
      ["d1", "11"],
    ],
    [
      ["a2", "00"],
      ["b2", "01"],
      ["c2", "10"],
      ["d2", "11"],
    ],
    [
      ["a3", "000"],
      ["b3", "001"],
      ["c3", "010"],
      ["d3", "011"],
      ["e3", "100"],
      ["f3", "101"],
      ["g3", "110"],
      ["h3", "111"],
    ],
  ],
};

class Logic {
  static binary(block) {
    const lhs = generator.valueToCode(block, "LHS", generator.PRECEDENCE);
    const rhs = generator.valueToCode(block, "RHS", generator.PRECEDENCE);
    const op = block.getFieldValue("OP");
    const code = `(${lhs} ${op} ${rhs})`;
    return [code, generator.PRECEDENCE];
  }

  static setupGenerator() {
    generator["_compare"] = this.binary;
    generator["_calculate"] = this.binary;
    generator["_logic"] = this.binary;
  }

  static insertBlocks() {
    // logic
    // &,|,<<,>>,^,~,%,**,+,-,*,/,
    // >,>=,<,<=,==,!=
    // &&,||
    // +@,-@,
    Blockly.defineBlocksWithJsonArray([
      {
        type: "_compare",
        message0: "%1 %2 %3 .",
        args0: [
          {
            type: "input_value",
            name: "LHS",
            check: ["Number", "Boolean"],
          },
          {
            type: "field_dropdown",
            name: "OP",
            options: [
              ["==", "=="],
              ["!=", "!="],
              ["<", "<"],
              ["<=", "<="],
              [">", ">"],
              [">=", ">="],
            ],
          },
          {
            type: "input_value",
            name: "RHS",
            check: ["Number", "Boolean"],
          },
        ],
        output: "Boolean",
        colour: "5b80a5",
      },
      {
        type: "_calculate",
        message0: "%1 %2 %3 .",
        args0: [
          {
            type: "input_value",
            name: "LHS",
            check: "Number",
          },
          {
            type: "field_dropdown",
            name: "OP",
            options: [
              ["+", "+"],
              ["-", "-"],
              ["*", "*"],
              ["/", "/"],
              ["%", "%"],

              ["&", "&"],
              ["|", "|"],
              ["^", "^"],

              ["<<", "<<"],
              [">>", ">>"],

              ["**", "**"],
              ["~", "~"],
            ],
          },
          {
            type: "input_value",
            name: "RHS",
            check: "Number",
          },
        ],
        output: "Number",
        colour: "5b80a5",
      },
      {
        type: "_logic",
        message0: "%1 %2 %3 .",
        args0: [
          {
            type: "input_value",
            name: "LHS",
            check: "Boolean",
          },
          {
            type: "field_dropdown",
            name: "OP",
            options: [
              ["&&", "&&"],
              ["||", "||"],
            ],
          },
          {
            type: "input_value",
            name: "RHS",
            check: "Boolean",
          },
        ],
        output: "Boolean",
        colour: "5b80a5",
      },
    ]);
  }
}

class StatusGroup {
  static setupGenerator(options) {
    if (options.statusGroup == undefined) {
      return 
    }
    // statusGroup: [
    //   ["bit35", "35"],
    //   ["bit36", "36"],
    // ],
    // statusGroupValue: [
    //   [["a1", "00"], ["b1", "01"], ["c1", "10"], ["d1", "11"]],
    //   [["a2", "00"], ["b2", "01"], ["c2", "10"], ["d2", "11"]],
    // ]
    var index = 0;
    for (index = 0; index < options.statusGroup.length; index++) {
      const bit = `${options.statusGroup[index][1]}`;
      const len = options.statusGroupLength[index];
      // status_group0_set
      generator[`status_group${index}_set`] = function (block) {
        const value = block.getFieldValue("VALUE");
        // Status.set({start_bit},{bit_len},{status_value})`
        // Status.set(35, 2, 0b01)
        const code = `Status.set(${bit}, ${len}, 0b${value})`;
        return code;
      };

      generator[`status_group${index}_get`] = function (block) {
        // Status.get({start_bit},{bit_len})`
        // Status.get(35, 2)
        const code = `Status.get(${bit}, ${len})`;
        return [code, 0];
      };
    }
  }

  static insertBlocks(options) {
    if (options.statusGroup == undefined) {
      return 
    }
    // statusGroup: [
    //   ["bit35", "35"],
    //   ["bit36", "36"],
    // ],
    // statusGroupValue: [
    //   [["a1", "00"], ["b1", "01"], ["c1", "10"], ["d1", "11"]],
    //   [["a2", "00"], ["b2", "01"], ["c2", "10"], ["d2", "11"]],
    // ]
    var index = 0;
    for (index = 0; index < options.statusGroup.length; index++) {
      const name = `${options.statusGroup[index][0]}`;
      const option = options.statusGroupValue[index];

      // Status.set({start_bit},{bit_len},{status_value})
      Blockly.defineBlocksWithJsonArray([
        {
          type: `status_group${index}_set`,
          /// 設定`溫度狀態`為`b`
          message0: "設定%1為%2",
          args0: [
            `${name}`,
            {
              type: "field_dropdown",
              name: "VALUE",
              options: option,
            },
          ],
          previousStatement: "Action",
          nextStatement: "Action",
          colour: "5ba55b",
        },
        {
          type: `status_group${index}_get`,

          message0: "取得%1",
          args0: [
            `${name}`
          ],
          output: "Number",
          colour: "5ba55b",
        }
      ]);
    }
  }
}

class Status {
  static setupGenerator(options) {
    // Status.get({start_bit},{bit_len})`
    generator["status_get"] = function (block) {
      const bit = block.getFieldValue("ID");
      const code = `Status.get(${bit}, 1)`;
      return [code, generator.PRECEDENCE];
    };

    // status: [["Status35", "35"], ["Status36", "36"], ["Status37", "37"], ["Status38", "38"], ["Status39", "39"]],
    // statusValue: [
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]]
    // ]
    var index = 0;
    for (index = 0; index < options.status.length; index++) {
      const bit = `${options.status[index][1]}`;
      // status35_set
      generator[`status${bit}_set`] = function (block) {
        const value = block.getFieldValue("VALUE");
        // Status.set({start_bit},{bit_len},{status_value})`
        // Status.set(35, 1, 0)
        const code = `Status.set(${bit}, 1, ${value})`;
        return code;
      };
    }
  }

  static insertBlocks(options) {
    // status: [["Status35", "35"], ["Status36", "36"], ["Status37", "37"], ["Status38", "38"], ["Status39", "39"]],
    // statusValue: [
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]],
    //     [["Normal", "1"], ["Error", "0"]]
    // ]
    var index = 0;
    for (index = 0; index < options.status.length; index++) {
      const bit = `${options.status[index][1]}`;
      const name = `${options.status[index][0]}`;
      const option = options.statusValue[index];

      // Status.set({start_bit},{bit_len},{status_value})
      Blockly.defineBlocksWithJsonArray([
        {
          type: `status${bit}_set`,
          message0: "%{BKY_SET_STATUS}",
          args0: [
            {
              type: "field_dropdown",
              name: "VALUE",
              options: option,
            },
            `${name}`,
          ],
          previousStatement: "Action",
          nextStatement: "Action",
          colour: "5ba55b",
        },
      ]);
    }

    Blockly.defineBlocksWithJsonArray([
      // Status.get({start_bit},{bit_len})`
      {
        type: "status_get",
        message0: "%{BKY_GET_STATUS}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.status,
          },
        ],
        output: "Number",
        colour: "5ba55b",
      },
    ]);
  }
}

class Value {
  static value(block) {
    const value = block.getFieldValue("VALUE");
    const code = `${value}`;
    return [code, generator.PRECEDENCE];
  }

  static boolean(block) {
    const value = block.getFieldValue("VALUE");
    const bool = value == "TRUE" ? "true" : "false";
    const code = `${bool}`;
    return [code, generator.PRECEDENCE];
  }

  static setupGenerator() {
    generator["value_number"] = this.value;
    generator["value_boolean"] = this.boolean;
  }

  static insertBlocks() {
    // value
    Blockly.defineBlocksWithJsonArray([
      {
        type: "value_number",
        message0: "%1",
        args0: [
          {
            type: "field_number",
            name: "VALUE",
          },
        ],
        output: "Number",
        colour: 355,
      },
      {
        type: "value_boolean",
        message0: "%1",
        args0: [
          {
            type: "field_checkbox",
            name: "VALUE",
          },
        ],
        output: "Boolean",
        colour: 355,
      },
    ]);
  }
}

class Sensor {
  static setupGenerator() {
    generator["sensor_get"] = Util.getValue("Sensor");
    generator["sensor_set"] = Util.setValue("Sensor");
    generator["vibration_sensor_get"] = function (block) {
      const id = block.getFieldValue("ID");
      const x = block.getField("X").getText();
      const y = block.getField("Y").getText();
      const z = block.getField("Z").getText();

      //      const check = x == y || y == z || z == x
      //      if (check) {
      //        throw new Error("變數名稱不可相同")
      //      }

      const code = `${x}, ${y}, ${z} = Sensor.get("${id}")`;
      return code;
    };
  }

  static insertBlocks(options) {
    // sensor
    Blockly.defineBlocksWithJsonArray([
      {
        type: "vibration_sensor_get",
        message0: "%{BKY_GET_VIBRATION_SENSOR}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.vibrationSensors,
          },
          {
            type: "field_variable",
            name: "X",
            variable: "x",
          },
          {
            type: "field_variable",
            name: "Y",
            variable: "y",
          },
          {
            type: "field_variable",
            name: "Z",
            variable: "z",
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "5ba55b",
      },
      {
        type: "sensor_get",
        message0: "%{BKY_GET_SENSOR}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.sensors,
          },
        ],
        output: "Number",
        colour: "5ba55b",
      },
      {
        type: "sensor_set",
        message0: "%{BKY_SET_SENSOR}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.sensors,
          },
          {
            type: "input_value",
            name: "VALUE",
            check: "Number",
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "5ba55b",
      },
    ]);
  }
}

class Timer {
  static setupGenerator() {
    generator["timer_get"] = Util.getValue("Timer");
    // timer
    generator["timer_reset"] = function (block) {
      const timer = block.getFieldValue("ID");
      const code = `Timer.reset("${timer}")`;
      return code;
    };
    generator["timer_onoff"] = function (block) {
      const timer = block.getFieldValue("ID");
      const value = block.getFieldValue("VALUE");
      const code = `Timer.onoff("${timer}", ${value})`;
      return code;
    };
  }

  static insertBlocks(options) {
    // timer
    Blockly.defineBlocksWithJsonArray([
      // Timer.get({timer_id})
      {
        type: "timer_get",
        message0: "%{BKY_GET_TIMER}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.timersGet,
          },
        ],
        output: "Number",
        colour: "cc9900",
      },
      // Timer.onoff({timer_id},{0/1})
      {
        type: "timer_onoff",
        message0: "%{BKY_ONOFF_TIMER}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.timersSet,
          },
          {
            type: "field_dropdown",
            name: "VALUE",
            options: [
              ["%{BKY_TURN_ON}", "1"],
              ["%{BKY_TURN_OFF}", "0"],
            ],
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "cc9900",
      },
      // Timer.reset({timer_id})
      {
        type: "timer_reset",
        message0: "%{BKY_RESET_TIMER}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.timersSet,
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "cc9900",
      },
    ]);
  }
}

class Counter {
  static setupGenerator() {
    generator["counter_get"] = Util.getValue("Counter");
    // counter
    generator["counter_reset"] = function (block) {
      const counter = block.getFieldValue("ID");
      const code = `Counter.reset("${counter}")`;
      return code;
    };
    generator["counter_count"] = function (block) {
      const counter = block.getFieldValue("ID");
      const code = `Counter.count("${counter}")`;
      return code;
    };
  }

  static insertBlocks(options) {
    Blockly.defineBlocksWithJsonArray([
      // Counter.get({counter_id})
      {
        type: "counter_get",
        message0: "%{BKY_GET_COUNTER}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.countersGet,
          },
        ],
        output: "Number",
        colour: "5ba55b",
      },
      // Counter.count({counter_id})
      {
        type: "counter_count",
        message0: "%{BKY_COUNT_COUNTER}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.countersSet,
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "5ba55b",
      },
      // Counter.reset({counter_id})
      {
        type: "counter_reset",
        message0: "%{BKY_RESET_COUNTER}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.countersSet,
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "5ba55b",
      },
    ]);
  }
}

class Global {
  static setupGenerator() {
    generator["global_get"] = Util.getValue("Global");
    generator["global_set"] = Util.setValue("Global");
  }

  static insertBlocks(options) {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "global_get",
        message0: "%{BKY_GET_GLOBAL}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.globalsGet,
          },
        ],
        output: "Number",
        colour: "5ba55b",
      },
      {
        type: "global_set",
        message0: "%{BKY_SET_GLOBAL}",
        args0: [
          {
            type: "field_dropdown",
            name: "ID",
            options: options.globalsSet,
          },
          {
            type: "input_value",
            name: "VALUE",
            check: "Number",
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "5ba55b",
      },
    ]);
  }
}

class Util {
  static setValue(name) {
    return (block) => {
      const id = block.getFieldValue("ID");
      const value = generator.valueToCode(block, "VALUE", generator.PRECEDENCE);
      const code = `${name}.set("${id}", ${value})`;
      return code;
    };
  }

  static getValue(name) {
    return (block) => {
      const id = block.getFieldValue("ID");
      const code = `${name}.get("${id}")`;
      return [code, generator.PRECEDENCE];
    };
  }
}

class Program {
  static setupGenerator() {
    generator["if_else"] = function (block) {
      let statement = generator.valueToCode(
        block,
        "STATEMENT",
        generator.PRECEDENCE
      );
      if (statement == null) {
        return "";
      }
      const ifClause = generator.statementToCode(
        block,
        "IF_CLAUSE",
        generator.PRECEDENCE
      );
      const elseClause = generator.statementToCode(
        block,
        "ELSE_CLAUSE",
        generator.PRECEDENCE
      );
      if (elseClause == null || elseClause == "") {
        return `if ${statement}\n${ifClause}\nend`;
      } else {
        return `if ${statement}\n${ifClause}\nelse\n${elseClause}\nend`;
      }
    };
  }

  static insertBlocks() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "if_else",
        message0: "%{BKY_IF}",
        args0: [
          {
            type: "input_value",
            name: "STATEMENT",
            check: "Boolean",
          },
        ],

        message1: "%{BKY_IF_DO}",
        args1: [
          {
            type: "input_statement",
            name: "IF_CLAUSE",
          },
        ],

        message2: "%{BKY_ELSE}",
        message3: "%{BKY_IF_DO}",
        args3: [
          {
            type: "input_statement",
            name: "ELSE_CLAUSE",
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
        colour: "995ba5",
      },
    ]);
  }
}

class Scrub {
  static setupGenerator() {
    generator.scrub_ = function (block, code, opt_thisOnly) {
      const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
      const nextCode = opt_thisOnly ? "" : generator.blockToCode(nextBlock);
      const isNeedSpace = nextBlock == null;

      const sep = isNeedSpace ? "" : "\n";
      return `${code}${sep}${nextCode}`;
    };
  }
}

class Variable {
  static setupGenerator() {
    generator["variables_get"] = function (block) {
      const _var = block.getField("VAR").getText();
      const code = _var;
      return [code, generator.PRECEDENCE];
    };

    generator["variables_set"] = function (block) {
      const _var = block.getField("VAR").getText();
      const value = generator.valueToCode(block, "VALUE", generator.PRECEDENCE);
      const code = `${_var} = ${value}`;
      return code;
    };

    generator["math_change"] = function (block) {
      const _var = block.getField("VAR").getText();
      const delta = generator.valueToCode(block, "DELTA", generator.PRECEDENCE);
      const code = `${_var} = ${delta}`;
      return code;
    };
  }
}

class _Math {
  static setupGenerator() {
    generator["math_change"] = function (block) {
      const _var = block.getField("VAR").getText();
      const delta = generator.valueToCode(block, "DELTA", generator.PRECEDENCE);
      const code = `${_var} = ${delta}`;
      return code;
    };

    generator["math_number"] = function (block) {
      const num = block.getFieldValue("NUM");
      const code = `${num}`;
      return [code, generator.PRECEDENCE];
    };
  }
}

/// 分 時 日 月 星期
/// 0 59
/// 0 23
/// 1 31
/// 1 12
/// 0 6
class Time {
  static minutes = Array.from(Array(60).keys()).map((x) => [`${x}`, `${x}`]);
  static hours = Array.from(Array(24).keys()).map((x) => [`${x}`, `${x}`]);
  static days = Array.from(Array(31).keys()).map((x) => [
    `${x + 1}`,
    `${x + 1}`,
  ]);
  static monthes = Array.from(Array(12).keys()).map((x) => [
    `${x + 1}`,
    `${x + 1}`,
  ]);
  static weeks = [
    ["星期日", "0"],
    ["星期一", "1"],
    ["星期二", "2"],
    ["星期三", "3"],
    ["星期四", "4"],
    ["星期五", "5"],
    ["星期六", "6"],
  ];

  static minutesAll = Time.minutes.concat([["Any", "*"]]);
  static hoursAll = Time.hours.concat([["Any", "*"]]);
  static daysAll = Time.days.concat([["Any", "*"]]);
  static monthesAll = Time.monthes.concat([["Any", "*"]]);
  static weeksAll = Time.weeks.concat([["Any", "*"]]);

  static setupGenerator() {
    Time.setupCommonGenerator("minute");
    Time.setupCommonGenerator("hour");
    Time.setupCommonGenerator("day");
    Time.setupCommonGenerator("month");
    Time.setupCommonGenerator("week");

    Time.setupTimeGenerator();
  }

  static setupCommonGenerator(unit) {
    generator[`${unit}_to`] = function (block) {
      const from = block.getFieldValue("FROM");
      const to = block.getFieldValue("TO");

      return [`${from}-${to}`, generator.PRECEDENCE];
    };

    generator[`${unit}_every`] = function (block) {
      const value = block.getFieldValue("VALUE");
      return [`*/${value}`, generator.PRECEDENCE];
    };

    generator[unit] = function (block) {
      const value = block.getFieldValue("VALUE");
      return [`${value}`, generator.PRECEDENCE];
    };
  }

  /// 分 時 日 月 星期
  static setupTimeGenerator() {
    generator["time"] = function (block) {
      const month = generator.valueToCode(block, "MONTH", generator.PRECEDENCE);
      const day = generator.valueToCode(block, "DAY", generator.PRECEDENCE);
      const hour = generator.valueToCode(block, "HOUR", generator.PRECEDENCE);
      const minute = generator.valueToCode(
        block,
        "MINUTE",
        generator.PRECEDENCE
      );
      const week = generator.valueToCode(block, "WEEK", generator.PRECEDENCE);
      return [
        `"${minute} ${hour} ${day} ${month} ${week}"`,
        generator.PRECEDENCE,
      ];
      // return ["acb", 0]
    };
  }
  /// Time.minutes Time.minutesAll "minute"
  /// -> minute_to minute_every minute
  static insertCommonBlock(optionSome, optionAll, unit, unitString) {
    Blockly.defineBlocksWithJsonArray([
      {
        type: `${unit}_to`,
        message0: `從 %1${unitString} 到 %2${unitString}`,
        args0: [
          {
            type: "field_dropdown",
            name: "FROM",
            options: optionSome,
          },
          {
            type: "field_dropdown",
            name: "TO",
            options: optionSome,
          },
        ],
        output: unit,
        colour: "995ba5",
      },
      {
        type: `${unit}_every`,
        message0: `每 %1${unitString}`,
        args0: [
          {
            type: "field_number",
            name: "VALUE",
          },
        ],
        output: unit,
        colour: "995ba5",
      },
      {
        type: unit,
        message0: `%1${unitString}`,
        args0: [
          {
            type: "field_dropdown",
            name: "VALUE",
            options: optionAll,
          },
        ],
        output: unit,
        colour: "995ba5",
      },
    ]);
  }

  static insertTimeBlock() {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "time",
        message0: "時間 %1 %2 %3 %4 %5",
        args0: [
          {
            type: "input_value",
            name: "MONTH",
            check: "month",
          },
          {
            type: "input_value",
            name: "DAY",
            check: "day",
          },
          {
            type: "input_value",
            name: "HOUR",
            check: "hour",
          },
          {
            type: "input_value",
            name: "MINUTE",
            check: "minute",
          },
          {
            type: "input_value",
            name: "WEEK",
            check: "week",
          },
        ],
        output: "Time",
        colour: "995ba5",
      },
    ]);
  }
  static insertBlocks() {
    Time.insertCommonBlock(Time.minutes, Time.minutesAll, "minute", "分");
    Time.insertCommonBlock(Time.hours, Time.hoursAll, "hour", "點");
    Time.insertCommonBlock(Time.days, Time.daysAll, "day", "日");
    Time.insertCommonBlock(Time.monthes, Time.monthesAll, "month", "月");
    Time.insertCommonBlock(Time.weeks, Time.weeksAll, "week", "星期");

    Time.insertTimeBlock();
  }
}

class Cron {
  static setupGenerator() {
    /// def a()
    ///     ...
    /// end
    generator["define_function"] = function (block) {
      const functionName = block.getField("NAME").getText();
      const body = generator.statementToCode(
        block,
        "BODY",
        generator.PRECEDENCE
      );
      return `def ${functionName}\n${body}\nend`;
    };

    generator["get_function"] = function (block) {
      const functionName = block.getField("NAME").getText();

      return functionName;
    };

    generator["cron"] = function (block) {
      const value = generator.valueToCode(block, "VALUE", generator.PRECEDENCE);
      const functionName = block.getField("NAME").getText();
      return `Cron.tab(${value}, "${functionName}")`;
    };

    // get_function
  }

  static insertBlocks() {
    Blockly.defineBlocksWithJsonArray([
      /// def a()
      ///     ...
      /// end
      {
        type: "define_function",
        message0: "def %1()",
        args0: [
          {
            type: "field_variable",
            name: "NAME",
            variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
            variableTypes: ["Function"], // Specifies what types to put in the dropdown
            defaultType: "Function",
          },
        ],

        message1: "%1",
        args1: [
          {
            type: "input_statement",
            name: "BODY",
          },
        ],

        message2: "end",

        // previousStatement: null,
        // nextStatement: null,
        colour: "995ba5",
      },
      {
        type: "cron",
        message0: "cron job on %1, do %2",
        args0: [
          {
            type: "input_value",
            name: "VALUE",
            variable: "abc",
            variableTypes: ["Time"], // Specifies what types to put in the dropdown
            defaultType: "Time",
            check: "Time",
          },
          {
            type: "field_variable",
            name: "NAME",
            variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
            variableTypes: ["Function"], // Specifies what types to put in the dropdown
            defaultType: "Function",
          },
        ],
        previousStatement: "Action",
        nextStatement: "Action",
      },
    ]);
  }
}

class Setup {
  static generator(options) {
    Logic.setupGenerator();
    Status.setupGenerator(options);
    StatusGroup.setupGenerator(options);
    Value.setupGenerator();
    Sensor.setupGenerator();
    Timer.setupGenerator();
    Counter.setupGenerator();
    Global.setupGenerator();
    Program.setupGenerator();

    Scrub.setupGenerator();
    Variable.setupGenerator();
    _Math.setupGenerator();

    Cron.setupGenerator();
    Time.setupGenerator();
  }

  static blocks(options) {
    Logic.insertBlocks();
    Status.insertBlocks(options);
    StatusGroup.insertBlocks(options);
    Value.insertBlocks();
    Sensor.insertBlocks(options);

    Timer.insertBlocks(options);
    Counter.insertBlocks(options);
    Global.insertBlocks(options);
    Program.insertBlocks();
    Cron.insertBlocks();
    Time.insertBlocks();
  }
}

class Box {
  static sensor(isUser, options) {
    var sensor_get =
      options.sensors == undefined || options.sensors.length == 0
        ? ""
        : '<block type="sensor_get"/>';

    //    TODO 只暫時開放使用者使用
    //    var sensor_set = options.sensors == undefined || options.sensors.length == 0 || isUser ? "" : '<block type="sensor_set"/>'
    var sensor_set =
      options.sensors == undefined || options.sensors.length == 0
        ? ""
        : '<block type="sensor_set"/>';

    var vibration_sensor_get =
      options.vibrationSensors == undefined ||
      options.vibrationSensors.length == 0
        ? ""
        : '<block type="vibration_sensor_get"/>';

    if (sensor_get == "" && sensor_set == "" && vibration_sensor_get == "") {
      return "";
    }

    return `
      <category name="Sensor" colour="115">
          ${sensor_get}
          ${sensor_set}
          ${vibration_sensor_get}
      </category>
    `;
  }

  static status(options) {
    if (options.status == undefined || options.status.length == 0) {
      return "";
    }

    /// status35_set
    let blocks = options.status
      /// data: ["bit35", "35"],
      .map((data) => `<block type="status${data[1]}_set"/>`)
      .join("\n");

    return `
    <category name="Status" colour="115">
        <block type="status_get"/>
        ${blocks}
    </category>
    `;
  }

  static statusGroup(options) {
    // const key = options.statusGroup[index]
    //   const option = options.statusGroupValue[index]

    if (options.statusGroup == undefined || options.statusGroup.length == 0) {
      return "";
    }

    if (options.statusGroup.length != options.statusGroupValue.length ||
        options.statusGroup.length != options.statusGroupLength.length) {
      return "";     
    }

    /// status_group0_set
    let blocks = options.statusGroup
      .map((_, i) => `<block type="status_group${i}_set"/>`)
      .join("\n");

    return `
    <category name="StatusGroup" colour="115">
      ${blocks}
    </category>
    `;
  }

  static cron(enable) {
    if (!enable) {
      return "";
    }

    return `
    <category name="Function" colour="269">
        <block type="define_function"/>
        <block type="cron"/>
    </category>
        
    <category name="Time" colour="269">
        <block type="time"/>
        <block type="minute"/>
        <block type="minute_to"/>
        <block type="minute_every"/>
        <block type="hour"/>
        <block type="hour_to"/>
        <block type="hour_every"/>
        <block type="day"/>
        <block type="day_to"/>
        <block type="day_every"/>
        <block type="month"/>
        <block type="month_to"/>
        <block type="month_every"/>
        <block type="week"/>
        <block type="week_to"/>
        <block type="week_every"/>
    </category>
    `;
  }
}

function createBox(isUser, options) {
  return `
    <xml id="toolbox" style="display: none">
        <category name="Value" colour="cc0700">
            <block type="value_number"/>
            <block type="value_boolean"/>
        </category>

        <category name="Variables" custom="VARIABLE" colour="ff8000"></category>

        <category name="Timer" colour="f5d214">
            <block type="timer_get"/>
            <block type="timer_reset"/>
            <block type="timer_onoff"/>
        </category>

        ${Box.sensor(isUser, options)}

        ${Box.status(options)}

        ${Box.statusGroup(options)}

        <category name="Counter" colour="115">
            <block type="counter_get"/>
            <block type="counter_reset"/>
            <block type="counter_count"/>
        </category>

        <category name="Global" colour="115">
            <block type="global_get"/>
            <block type="global_set"/>
        </category>

        <category name="Logic" colour="210">
            <block type="_compare"/>
            <block type="_calculate"/>
            <block type="_logic"/>
        </category>

        <category name="Program" colour="269">
            <block type="if_else"/>
        </category>

        ${Box.cron(false)}
    </xml>
`;
}

// Native call js
function dumpXML() {
  const workspace = Blockly.getMainWorkspace();
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const xmlString = Blockly.Xml.domToText(xml);
  return xmlString;
}
function codeGen() {
  const workspace = Blockly.getMainWorkspace();
  const code = generator.workspaceToCode(workspace);
  console.log(' ===YourCodeIs==== \n'+code+'\n =======')
  return code;
}

function dumpAll() {
  const json = {
    xml: dumpXML(),
    code: codeGen(),
  };
  return JSON.stringify(json);
}

function dumpCode() {
  const json = {
    xml: "",
    code: codeGen(),
  };
  return JSON.stringify(json);
}

function save() {
  native.save(dumpAll());
}

function load(xmlString) {
  const workspace = Blockly.getMainWorkspace();
  workspace.clear();
  const xml = Blockly.Xml.textToDom(xmlString);
  Blockly.Xml.domToWorkspace(xml, workspace);
}

function onChange(event) {
  const type = event.type;
  const condition =
    type == Blockly.Events.BLOCK_DRAG ||
    type == Blockly.Events.TOOLBOX_ITEM_SELECT ||
    type == Blockly.Events.CLICK ||
    //    type == Blockly.Events.CREATE ||
    type == Blockly.Events.SELECTED;
  if (condition) {
    return;
  }

  native.onChange(dumpCode());
}

let box;
function initialize(options) {
  //BLOCKLY_TOOLBOX_XML['standard'],
  //  const box = isUser ? userBox : vendorBox;
  const isUser = true;
  const _box = createBox(isUser, options);

  box = _box;
  Setup.generator(options);
  Setup.blocks(options);

  setTimeout(function () {
    const workspace = Blockly.getMainWorkspace();
    workspace.addChangeListener(onChange);
  }, 1000);

  if (document.getElementById("blocklyDiv") != null) {
    workspacePlayground = Blockly.inject("blocklyDiv", {
      media: "media/",
      toolbox: _box,
      zoom: { controls: true },
    });
  }
}

native = {};
if (window.webkit != null) {
  native.onChange = (code) => {
    window.webkit.messageHandlers.onChange.postMessage(code);
  };
  native.save = (code) => {
    window.webkit.messageHandlers.onSave.postMessage(code);
  };
} else if (window.AndroidWebView) {
  native.onChange = (code) => {
    window.AndroidWebView.onChange(code);
  };
  native.save = (code) => {
    window.AndroidWebView.onSave(code);
  };
} else {
  native.onChange = (code) => {
    //console.log(`onChange ${code}`);
  };
  native.save = (code) => {
    //console.log(`save ${code}`);
  };
}

// if (window.location.href.startsWith("file:///")) {
//   initialize(Constants);
// }
function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

if (getOS() == "Mac OS") {
  initialize(Constants);
}
// if (3>1) {
//   initialize(Constants);
// }

Constants