import {
  _decorator,
  Camera,
  Canvas,
  Color,
  Component,
  EditBox,
  Graphics,
  Label,
  Layers,
  Node,
  UITransform,
  Vec3,
  view,
} from 'cc';

const { ccclass } = _decorator;

/** A small, self-contained demo login screen. It does not send or store credentials. */
@ccclass('LoginUI')
export class LoginUI extends Component {
  private accountInput: EditBox | null = null;
  private passwordInput: EditBox | null = null;
  private statusLabel: Label | null = null;

  onLoad() {
    const visibleSize = view.getVisibleSize();
    const canvasNode = new Node('LoginCanvas');
    canvasNode.layer = Layers.Enum.UI_2D;
    const canvasTransform = canvasNode.addComponent(UITransform);
    canvasTransform.setContentSize(visibleSize);
    canvasTransform.setAnchorPoint(0.5, 0.5);

    const canvas = canvasNode.addComponent(Canvas);
    const cameraNode = this.node.scene?.getChildByName('Main Camera');
    const camera = cameraNode?.getComponent(Camera) ?? null;
    if (camera) {
      camera.visibility |= Layers.Enum.UI_2D;
      canvas.cameraComponent = camera;
    }
    this.node.addChild(canvasNode);

    this.drawBox(
      canvasNode,
      'Backdrop',
      visibleSize.width,
      visibleSize.height,
      0,
      0,
      new Color(10, 18, 36, 255),
    );

    const cardWidth = Math.min(420, visibleSize.width - 40);
    const cardHeight = Math.min(500, visibleSize.height - 32);
    const card = this.drawBox(
      canvasNode,
      'LoginCard',
      cardWidth,
      cardHeight,
      0,
      0,
      new Color(22, 33, 57, 255),
      new Color(54, 72, 105, 255),
    );

    this.addLabel(
      card,
      'Title',
      '欢迎回来',
      30,
      178,
      28,
      new Color(245, 248, 255, 255),
      true,
    );
    this.addLabel(
      card,
      'Subtitle',
      '登录账号以继续',
      0,
      142,
      15,
      new Color(164, 178, 204, 255),
      true,
    );

    const fieldWidth = cardWidth - 64;
    this.addLabel(
      card,
      'AccountCaption',
      '邮箱 / 用户名',
      -fieldWidth / 2,
      94,
      14,
      new Color(193, 205, 225, 255),
      false,
      fieldWidth,
      24,
    );
    this.accountInput = this.addEditBox(
      card,
      'AccountInput',
      fieldWidth,
      50,
      0,
      52,
      '请输入邮箱或用户名',
    );
    this.accountInput.inputMode = EditBox.InputMode.EMAIL_ADDR;
    this.accountInput.maxLength = 64;

    this.addLabel(
      card,
      'PasswordCaption',
      '密码',
      -fieldWidth / 2,
      12,
      14,
      new Color(193, 205, 225, 255),
      false,
      fieldWidth,
      24,
    );
    this.passwordInput = this.addEditBox(
      card,
      'PasswordInput',
      fieldWidth,
      50,
      0,
      -30,
      '请输入密码',
    );
    this.passwordInput.inputMode = EditBox.InputMode.SINGLE_LINE;
    this.passwordInput.inputFlag = EditBox.InputFlag.PASSWORD;
    this.passwordInput.maxLength = 64;

    const button = this.drawBox(
      card,
      'LoginButton',
      fieldWidth,
      52,
      0,
      -112,
      new Color(84, 125, 255, 255),
    );
    this.addLabel(
      button,
      'ButtonText',
      '登 录',
      0,
      0,
      17,
      new Color(255, 255, 255, 255),
      true,
      fieldWidth,
      52,
    );
    button.on(Node.EventType.TOUCH_END, this.handleLogin, this);

    this.statusLabel = this.addLabel(
      card,
      'Status',
      '',
      0,
      -158,
      14,
      new Color(255, 190, 120, 255),
      true,
      fieldWidth,
      28,
    );
    this.addLabel(
      card,
      'DemoNote',
      '演示界面 · 尚未连接登录服务',
      0,
      -204,
      12,
      new Color(130, 148, 177, 255),
      true,
      fieldWidth,
      24,
    );
  }

  private handleLogin() {
    const account = this.accountInput?.string.trim() ?? '';
    const password = this.passwordInput?.string ?? '';
    if (!account || !password) {
      if (this.statusLabel) this.statusLabel.string = '请填写账号和密码';
      return;
    }
    if (this.statusLabel)
      this.statusLabel.string = '界面已就绪，请接入实际登录服务';
  }

  private drawBox(
    parent: Node,
    name: string,
    width: number,
    height: number,
    x: number,
    y: number,
    fill: Color,
    stroke?: Color,
  ): Node {
    const node = new Node(name);
    node.layer = Layers.Enum.UI_2D;
    node.setPosition(new Vec3(x, y, 0));
    const transform = node.addComponent(UITransform);
    transform.setContentSize(width, height);
    transform.setAnchorPoint(0.5, 0.5);
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = fill;
    graphics.roundRect(-width / 2, -height / 2, width, height, 12);
    graphics.fill();
    if (stroke) {
      graphics.lineWidth = 1;
      graphics.strokeColor = stroke;
      graphics.roundRect(-width / 2, -height / 2, width, height, 12);
      graphics.stroke();
    }
    parent.addChild(node);
    return node;
  }

  private addLabel(
    parent: Node,
    name: string,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: Color,
    centered: boolean,
    width = 300,
    height = 32,
  ): Label {
    const node = new Node(name);
    node.layer = Layers.Enum.UI_2D;
    node.setPosition(new Vec3(x, y, 0));
    const transform = node.addComponent(UITransform);
    transform.setContentSize(width, height);
    transform.setAnchorPoint(centered ? 0.5 : 0, 0.5);
    const label = node.addComponent(Label);
    label.useSystemFont = true;
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 8;
    label.color = color;
    label.horizontalAlign = centered
      ? Label.HorizontalAlign.CENTER
      : Label.HorizontalAlign.LEFT;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    parent.addChild(node);
    return label;
  }

  private addEditBox(
    parent: Node,
    name: string,
    width: number,
    height: number,
    x: number,
    y: number,
    placeholder: string,
  ): EditBox {
    const node = this.drawBox(
      parent,
      name,
      width,
      height,
      x,
      y,
      new Color(13, 22, 40, 255),
      new Color(48, 64, 91, 255),
    );
    const editBox = node.addComponent(EditBox);
    editBox.string = '';
    editBox.placeholder = placeholder;
    editBox.fontSize = 16;
    editBox.placeholderFontSize = 15;
    editBox.fontColor = new Color(235, 240, 250, 255);
    editBox.placeholderFontColor = new Color(115, 132, 160, 255);
    return editBox;
  }
}
